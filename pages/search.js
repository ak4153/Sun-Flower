import Layout from '../components/Layout';
import {
  Card,
  Grid,
  CardActionArea,
  CardMedia,
  CardContent,
  Typography,
  CardActions,
  Button,
  List,
  ListItem,
  CircularProgress,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@material-ui/core';
import Product from '../models/product';
import NextLink from 'next/link';
import dynamicSSR from '../utils/dynamicFunction';
import db from '../utils/db';

import handleAddToCartFuncion from '../utils/handleAddToCart';
import { useRouter } from 'next/router';
import { useContext, useEffect, useReducer, useState } from 'react';
import { Store } from '../utils/Store';
import { Alert, AlertTitle } from '@material-ui/lab';
import useStyles from '../utils/styles';
import axios from 'axios';
import Error from '../components/Error';
//pagination
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';

const PAGE_SIZE = 3;
function reducer(state, action) {
  switch (action.type) {
    case 'FETCH__REQUEST':
      return { ...state, loading: true, error: '' };
    case 'FETCH__SUCCESS':
      return { ...state, products: action.payload, loading: false, error: '' };
    case 'FETCH__FAIL':
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    default:
      return state;
  }
}
const prices = [
  { name: '1$-50$', value: '1-50' },
  { name: '51$-100$', value: '51-100' },
  { name: '101$-150$', value: '151-200' },
  { name: '201$-9000$', value: '201-9000' },
];
const ratings = [
  { name: '1 Star', value: 1 },
  { name: '2 Star', value: 2 },
  { name: '3 Star', value: 3 },
  { name: '4 Star', value: 4 },
  { name: '5 Star', value: 5 },
];
export default function Search(props) {
  const { state, dispatch } = useContext(Store);
  const router = useRouter();
  const [alert, setAlert] = useState('');
  const classess = useStyles();
  const { products, countProducts, categories, brands, pages, page } = props;
  //queries
  const filterSearch = ({
    page,
    category,
    brand,
    sort,
    min,
    max,
    searchQuery,
    price,
    rating,
  }) => {
    const path = router.pathname;
    const { query } = router;
    if (page) query.page = page;
    if (searchQuery) query.searchQuery = searchQuery;
    if (sort) query.sort = sort;
    if (category) query.category = category;
    if (brand) query.brand = brand;
    if (price) query.price = price;
    if (rating) query.rating = rating;
    if (min) query.min ? query.min : query.min === 0 ? 0 : min;
    if (max) query.max ? query.max : query.max === 0 ? 0 : max;
    //building a query
    router.push({
      pathname: path,
      query: query,
    });
  };

  //default values if there isn't one
  const {
    query = 'all',
    category = 'all',
    brand = 'all',
    price = 'all',
    rating = 'all',
    sort = 'featured',
  } = router.query;

  const handleCategoryChange = (val) => {
    category = val;
    filterSearch({ category: val });
  };
  const handleBrandChange = (val) => {
    brand = val;
    filterSearch({ brand: val });
  };
  const handlePriceChange = (val) => {
    price = val;
    filterSearch({ price: val });
  };
  const handleRatingChange = (val) => {
    rating = val;
    filterSearch({ rating: val });
  };
  const handleSortChange = (val) => {
    sort = val;
    filterSearch({ sort: val });
  };
  const handlePagination = (event, value) => {
    filterSearch({ page: Number(value) });
  };
  return (
    <Layout>
      {/* {loading && <CircularProgress></CircularProgress>} */}
      {/* <Error message={error} severity="error"></Error> */}

      <Grid container spacing={1} className={classess.section}>
        {/*grid item will have 4 products
             for line on medium devices*/}
        <Grid item xs={5} md={3}>
          <Grid container>
            <Grid item xs={12} md={12}>
              <Card>
                <CardContent>
                  <List>
                    <List disablePadding={true}>
                      <ListItem disablePadding={true}>
                        <Typography>Categories</Typography>
                      </ListItem>
                      <ListItem>
                        <FormControl fullWidth>
                          <Select
                            onChange={(e) =>
                              handleCategoryChange(e.target.value)
                            }
                            value={category}
                          >
                            <MenuItem value="all">All</MenuItem>
                            {categories.map((category) => (
                              <MenuItem key={category} value={category}>
                                {category}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </ListItem>
                    </List>
                    <List disablePadding={true}>
                      <ListItem disablePadding={true}>
                        <Typography>Brands</Typography>
                      </ListItem>
                      <ListItem>
                        <FormControl fullWidth>
                          <Select
                            value={brand}
                            onChange={(e) => handleBrandChange(e.target.value)}
                          >
                            <MenuItem value="all">All</MenuItem>
                            {brands.map((brand) => (
                              <MenuItem key={brand} value={brand}>
                                {brand}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </ListItem>
                    </List>
                    <List disablePadding={true}>
                      <ListItem disablePadding={true}>
                        <Typography>Prices</Typography>
                      </ListItem>
                      <ListItem>
                        <FormControl fullWidth>
                          <Select
                            onChange={(e) => handlePriceChange(e.target.value)}
                            value={price}
                          >
                            <MenuItem value="all">All</MenuItem>
                            {prices.map((price) => (
                              <MenuItem key={price.value} value={price.value}>
                                {price.name}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </ListItem>
                    </List>
                    <List disablePadding={true}>
                      <ListItem disablePadding={true}>
                        <Typography>Ratings</Typography>
                      </ListItem>
                      <ListItem>
                        <FormControl fullWidth>
                          <Select
                            onChange={(e) => handleRatingChange(e.target.value)}
                            value={rating}
                          >
                            <MenuItem value="all">All</MenuItem>
                            {ratings.map((rating) => (
                              <MenuItem key={rating.name} value={rating.value}>
                                {rating.name}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </ListItem>
                    </List>
                  </List>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Grid>

        <Grid item xs={8}>
          <Grid container spacing={1}>
            <Grid item xs={8}>
              <Typography>{countProducts} Result(s)</Typography>
            </Grid>

            <Grid item>
              <FormControl fullWidth>
                <Typography>Sort by</Typography>
                <Select
                  onChange={(e) => handleSortChange(e.target.value)}
                  value={sort}
                >
                  <MenuItem value="featured">Featured</MenuItem>
                  <MenuItem value="lowest">Price: Low to High</MenuItem>
                  <MenuItem value="highest">Price: High to Low</MenuItem>
                  <MenuItem value="toprated">Customer Reviews</MenuItem>
                  <MenuItem value="newest">Newest Arrivals</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>

          <Grid container spacing={1}>
            {products.length > 0
              ? products.map((product) => (
                  <Grid item xs={10} md={6} key={product.name}>
                    <Card className={classess.indexCard}>
                      <NextLink href={`/product/${product.slug}`} passHref>
                        <CardActionArea>
                          <CardMedia
                            className={classess.cardMedia}
                            component="img"
                            image={product.image}
                            title={product.name}
                          ></CardMedia>
                          <CardContent>
                            <Typography>{product.name}</Typography>
                          </CardContent>
                        </CardActionArea>
                      </NextLink>

                      <CardActions>
                        <Typography>${product.price}</Typography>
                        <Button
                          onClick={() =>
                            handleAddToCartFuncion(
                              dispatch,
                              product,
                              router,
                              state,
                              setAlert
                            )
                          }
                          size="small"
                          color="primary"
                        >
                          Add to cart
                        </Button>
                      </CardActions>
                    </Card>
                  </Grid>
                ))
              : ''}
            <Grid item xs={12} md={12} className={classess.section}>
              <Stack>
                <Pagination
                  onChange={handlePagination}
                  page={Number(page)}
                  count={pages}
                  color="primary"
                />
              </Stack>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Layout>
  );
}

export async function getServerSideProps({ query }) {
  await db.connect();

  //queries taken from URL
  const pageSize = query.pageSize || PAGE_SIZE;
  const page = query.page || 1;
  const category = query.category || '';
  const brand = query.brand || '';
  const price = query.price || '';
  const rating = query.rating || '';
  const sort = query.sort || '';
  const searchQuery = query.query || '';

  const order =
    sort === 'featured'
      ? { featured: -1 }
      : sort === 'lowest'
      ? { price: 1 }
      : sort === 'highest'
      ? { price: -1 }
      : sort === 'toprated'
      ? { rating: -1 }
      : sort === 'newest'
      ? { createdAt: -1 }
      : { _id: -1 };

  const queryFilter =
    searchQuery && searchQuery !== 'all'
      ? { name: { $regex: searchQuery, $options: 'i' } }
      : {};

  const categoryFilter =
    category && category !== 'all'
      ? { category: { $regex: category, $options: 'i' } }
      : {};

  const brandFilter =
    brand && brand !== 'all' ? { brand: { $regex: brand, $options: 'i' } } : {};

  const ratingFilter =
    rating && rating !== 'all' ? { rating: { $gte: rating } } : {};

  const priceFilter =
    price && price !== 'all'
      ? {
          price: {
            $gte: Number(price.split('-')[0]),
            $lte: Number(price.split('-')[1]),
          },
        }
      : {};

  var products = await Product.find({
    ...queryFilter,
    ...categoryFilter,
    ...brandFilter,
    ...priceFilter,
    ...ratingFilter,
  })
    .sort(order)
    //page 1 is zero because we dont skip any values
    .skip(pageSize * (page - 1))
    .limit(pageSize)
    .lean();

  //only JSON is passed here
  products = products.map((prod) => db.convertDocToObj(prod));

  const countProducts = await Product.find({
    ...queryFilter,
    ...categoryFilter,
    ...brandFilter,
    ...priceFilter,
    ...ratingFilter,
  }).count();

  const pages = Math.ceil(countProducts / pageSize);

  const categories = await Product.find().distinct('category');
  const brands = await Product.find().distinct('brand');

  await db.disconnect();

  return {
    props: {
      products,
      pages,
      countProducts,
      brands,
      categories,
      page,
    },
  };
}
