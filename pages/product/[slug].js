import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';
import {
  Link,
  Grid,
  List,
  ListItem,
  Typography,
  Card,
  Button,
} from '@material-ui/core';
import { StarRating } from 'react-star-rating-element';
import NextLink from 'next/link';
import Image from 'next/image';
import useStyles from '../../utils/styles';
import db from '../../utils/db';
import Product from '../../models/product';
// import Review from '../../models/product';
import { useContext } from 'react';
import handleAddToCartFuncion from '../../utils/handleAddToCart';
import { Store } from '../../utils/Store';
import Error from '../../components/Error';
import CostumerReview from '../../components/CostumerReview.js';

//this works as follows:
//you have a hyper link to /product/:slug
//next goes to            ./page/product/[slug]
//so if you want to create a diff route follow the same pattern
export default function ProductScreen(props) {
  const router = useRouter();
  const classes = useStyles();
  const { state, dispatch } = useContext(Store);
  const { product } = props;
  const [alert, setAlert] = useState();
  //passing to costumer review component
  //for props
  const [renderSuccess, setRenderSuccess] = useState(false);
  if (!product) {
    return <div>Product Not Found</div>;
  }

  return (
    <Layout title={product.name} description={product.description}>
      {alert && <Error message="Out of stock"></Error>}
      <div className={classes.section}>
        <NextLink href="/" passHref>
          <Link>
            <Typography>Back to products</Typography>
          </Link>
        </NextLink>
      </div>
      {/*for small devices occupy whole width */}
      <Grid container spacing={1}>
        <Grid item md={6} xs={12}>
          <Card>
            <Image
              src={product.image}
              alt={product.name}
              width={640}
              height={640}
              layout="responsive"
            />
          </Card>
        </Grid>

        <Grid item md={3} xs={12}>
          <Card>
            <List>
              <ListItem>
                {/*component h1, for seo */}
                <Typography component="h1" variant="h1">
                  {product.name}
                </Typography>
              </ListItem>
              <ListItem>
                <Typography>Category: {product.category}</Typography>
              </ListItem>

              <ListItem>
                <Typography>Brand: {product.brand}</Typography>
              </ListItem>
              <ListItem>
                <Typography>Reviews: {product.numReviews}</Typography>
              </ListItem>
              <ListItem>
                <StarRating
                  ratingValue={product.rating}
                  changeRating={() => product.rating}
                />
              </ListItem>
              <ListItem>
                <Typography>Description: {product.description}</Typography>
              </ListItem>
            </List>
          </Card>
        </Grid>
        <Grid item md={3} xs={12}>
          <Card>
            <List>
              <ListItem>
                <Grid container>
                  <Grid item xs={6}>
                    <Typography>price:</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography>${product.price}</Typography>
                  </Grid>
                </Grid>
              </ListItem>
              <ListItem>
                <Grid container>
                  <Grid item xs={6}>
                    <Typography>
                      {product.countInStock > 0 ? 'In stock' : 'Out of stock'}
                    </Typography>
                  </Grid>
                </Grid>
              </ListItem>
              <ListItem>
                <Button
                  type="button"
                  color="primary"
                  fullWidth
                  variant="contained"
                  onClick={() =>
                    handleAddToCartFuncion(
                      dispatch,
                      product,
                      router,
                      state,
                      setAlert
                    )
                  }
                >
                  Add to cart
                </Button>
              </ListItem>
            </List>
          </Card>
        </Grid>
      </Grid>
      <CostumerReview
        setRenderSuccess={setRenderSuccess}
        productId={product._id}
      ></CostumerReview>
    </Layout>
  );
}
//this function will be pre-rendered on each request using the data returned by it
//context, along with other data will be passed to this function
//https://nextjs.org/docs/api-reference/data-fetching/get-server-side-props
export async function getServerSideProps(context) {
  const { params } = context;
  const { slug } = params;
  await db.connect();
  var product = await Product.findOne({ slug: slug }, '-reviews').lean();

  //pay close attention to .lean() which converts the document from mongodb
  //to a smaller javascript object
  //then we need to convert the _id,createdAt,updatedAt fields to string from plain objects
  //only numbers,string and bool are applicable

  // var reviews = await Review.find({ productId: product._id });

  // reviews = reviews.map((review) => db.convertDocToObj(review));
  //todo reviews
  await db.disconnect();
  return {
    props: {
      product: db.convertDocToObj(product),
    },
  };
}
