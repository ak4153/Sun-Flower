import {
  Button,
  Card,
  CardContent,
  CircularProgress,
  Grid,
  Input,
  List,
  ListItem,
  TextField,
  Typography,
} from '@material-ui/core';
import Product from '../../../models/product';
import React, { useContext, useEffect, useReducer, useState, FC } from 'react';
import Layout from '../../../components/Layout';
import useStyles from '../../../utils/styles';
import axios from 'axios';
import { Store } from '../../../utils/Store';
import dynamicSSR from '../../../utils/dynamicFunction';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import AdminSideBar from '../../../components/AdminSideBar';
import Error from '../../../components/Error';
import db from '../../../utils/db';
import { Controller, useForm } from 'react-hook-form';
function reducer(state, action) {
  switch (action.type) {
    case 'FETCH_REQUEST': {
      return { ...state, loading: true, error: '' };
    }
    case 'FETCH_SUCCESS': {
      return { ...state, products: action.payload, loading: false, error: '' };
    }
    case 'FETCH_FAIL': {
      return {
        ...state,
        products: action.payload,
        loading: false,
        error: 'failed to fetch products',
      };
    }
    default:
      state;
  }
}

function ProductsHistory(props) {
  const [{ loading, error, products }, dispatch] = useReducer(reducer, {
    loading: false,
    error: '',
    products: [],
  });

  const {
    handleSubmit,
    register,
    formState: { errors },
    control,
  } = useForm();

  const classess = useStyles();
  const { state } = useContext(Store);
  const { user } = state;
  const router = useRouter();
  const [alert, setAlert] = useState('');
  const { product } = props;
  const productId = product._id;
  useEffect(() => {
    if (!user) router.push('/login');
  }, []);
  const onSubmit = ({
    name,
    brand,
    description,
    countInStock,
    price,
    category,
    image,
    slug,
  }) => {
    axios
      .post(
        '/api/admin/products/id',
        {
          productId,
          name,
          brand,
          description,
          countInStock,
          price,
          category,
          image,
          slug,
        },
        {
          headers: { authorization: `Bearer ${user.token}` },
        }
      )
      .then((result) => {
        setAlert('succefully updated product info');
      })
      .catch((err) => setAlert(err.message));
  };
  return (
    <Layout title="Edit Product">
      <form onSubmit={handleSubmit(onSubmit)}>
        {alert && <Error message={alert}></Error>}

        <Grid
          spacing={1}
          container
          className={classess.section}
          justifyContent="center"
        >
          <AdminSideBar selected={'products'}></AdminSideBar>

          <Grid item md={9} xs={12} className={classess.section}>
            <Card>
              <CardContent>
                <Typography component="h1" variant="h1">
                  Edit product {product._id}
                </Typography>
                <List>
                  <ListItem>
                    <Controller
                      name="name"
                      control={control}
                      defaultValue={product.name}
                      rules={{
                        required: true,
                        minLength: 3,
                      }}
                      render={({ field }) => (
                        <TextField
                          {...register('name', { required: true })}
                          id="name"
                          label="name"
                          fullWidth
                          variant="outlined"
                          type="text"
                          inputProps={{ type: 'text' }}
                          error={Boolean(errors.name)}
                          helperText={
                            errors.description
                              ? errors.description.type === 'minLength'
                                ? "name isn't valid, minimum of 3 characters"
                                : 'name is required'
                              : ''
                          }
                          {...field}
                        />
                      )}
                    ></Controller>
                  </ListItem>
                  <ListItem>
                    <Controller
                      name="slug"
                      control={control}
                      defaultValue={product.slug}
                      rules={{
                        required: true,
                        minLength: 3,
                      }}
                      render={({ field }) => (
                        <TextField
                          {...register('slug', { required: true })}
                          id="slug"
                          label="slug"
                          fullWidth
                          variant="outlined"
                          type="text"
                          inputProps={{ type: 'text' }}
                          error={Boolean(errors.slug)}
                          helperText={
                            errors.slug
                              ? errors.slug.type === 'minLength'
                                ? "slug isn't valid, minimum of 3 characters"
                                : 'slug is required'
                              : ''
                          }
                          {...field}
                        />
                      )}
                    ></Controller>
                  </ListItem>
                  <ListItem>
                    <Controller
                      name="price"
                      control={control}
                      defaultValue={product.price}
                      rules={{
                        required: true,
                        minLength: 3,
                      }}
                      render={({ field }) => (
                        <TextField
                          {...register('price', { required: true })}
                          id="price"
                          label="price"
                          fullWidth
                          variant="outlined"
                          type="text"
                          inputProps={{ type: 'text' }}
                          error={Boolean(errors.price)}
                          helperText={
                            errors.price
                              ? errors.price.type === 'minLength'
                                ? "price isn't valid, minimum of 3 characters"
                                : 'price is required'
                              : ''
                          }
                          {...field}
                        />
                      )}
                    ></Controller>
                  </ListItem>

                  <ListItem>
                    <Controller
                      name="image"
                      control={control}
                      defaultValue={product.image}
                      rules={{
                        required: true,
                        minLength: 3,
                      }}
                      render={({ field }) => (
                        <TextField
                          {...register('image', { required: true })}
                          id="image"
                          label="image"
                          fullWidth
                          variant="outlined"
                          type="text"
                          inputProps={{ type: 'text' }}
                          error={Boolean(errors.image)}
                          helperText={
                            errors.image
                              ? errors.image.type === 'minLength'
                                ? "image isn't valid, minimum of 3 characters"
                                : 'image is required'
                              : ''
                          }
                          {...field}
                        />
                      )}
                    ></Controller>
                  </ListItem>
                  <ListItem>
                    <Controller
                      name="category"
                      control={control}
                      defaultValue={product.category}
                      rules={{
                        required: true,
                        minLength: 3,
                      }}
                      render={({ field }) => (
                        <TextField
                          {...register('category', { required: true })}
                          id="category"
                          label="category"
                          fullWidth
                          variant="outlined"
                          type="text"
                          inputProps={{ type: 'text' }}
                          error={Boolean(errors.category)}
                          helperText={
                            errors.category
                              ? errors.category.type === 'minLength'
                                ? "category isn't valid, minimum of 3 characters"
                                : 'category is required'
                              : ''
                          }
                          {...field}
                        />
                      )}
                    ></Controller>
                  </ListItem>
                  <ListItem>
                    <Controller
                      name="brand"
                      control={control}
                      defaultValue={product.brand}
                      rules={{
                        required: true,
                        minLength: 3,
                      }}
                      render={({ field }) => (
                        <TextField
                          {...register('brand', { required: true })}
                          id="brand"
                          label="brand"
                          fullWidth
                          variant="outlined"
                          type="text"
                          inputProps={{ type: 'text' }}
                          error={Boolean(errors.brand)}
                          helperText={
                            errors.brand
                              ? errors.brand.type === 'minLength'
                                ? "brand isn't valid, minimum of 3 characters"
                                : 'brand is required'
                              : ''
                          }
                          {...field}
                        />
                      )}
                    ></Controller>
                  </ListItem>
                  <ListItem>
                    <Controller
                      name="countInStock"
                      control={control}
                      defaultValue={product.countInStock}
                      rules={{
                        required: true,
                        minLength: 3,
                      }}
                      render={({ field }) => (
                        <TextField
                          {...register('countInStock', { required: true })}
                          id="countInStock"
                          label="countInStock"
                          fullWidth
                          variant="outlined"
                          type="text"
                          inputProps={{ type: 'text' }}
                          error={Boolean(errors.countInStock)}
                          helperText={
                            errors.countInStock
                              ? errors.countInStock.type === 'minLength'
                                ? "countInStock isn't valid, minimum of 3 characters"
                                : 'countInStock is required'
                              : ''
                          }
                          {...field}
                        />
                      )}
                    ></Controller>
                  </ListItem>

                  <ListItem>
                    <Controller
                      name="description"
                      control={control}
                      defaultValue={product.description}
                      rules={{
                        required: true,
                        minLength: 3,
                      }}
                      render={({ field }) => (
                        <TextField
                          {...register('description', { required: true })}
                          id="description"
                          label="description"
                          fullWidth
                          variant="outlined"
                          type="text"
                          inputProps={{ type: 'text' }}
                          error={Boolean(errors.description)}
                          helperText={
                            errors.description
                              ? errors.description.type === 'minLength'
                                ? "description isn't valid, minimum of 3 characters"
                                : 'description is required'
                              : ''
                          }
                          {...field}
                        />
                      )}
                    ></Controller>
                  </ListItem>
                  <ListItem>
                    <Button
                      fullWidth
                      align="center"
                      type="submit"
                      variant="contained"
                      color="primary"
                    >
                      UPDATE
                    </Button>
                  </ListItem>
                </List>
              </CardContent>

              <List>
                {loading && <CircularProgress />}
                <ListItem></ListItem>
              </List>
            </Card>
          </Grid>
        </Grid>
      </form>
    </Layout>
  );
}
export async function getServerSideProps(context) {
  const { params } = context;
  const { id } = params;

  await db.connect();
  var product = await Product.findById(id).lean();
  //pay close attention to .lean() which converts the document from mongodb
  //to a smaller javascript object
  //then we need to convert the _id,createdAt,updatedAt fields to string from plain objects
  //only numbers,string and bool are applicable
  product = db.convertDocToObj(product);

  await db.disconnect();
  return {
    props: {
      product,
    },
  };
}

export default dynamicSSR(ProductsHistory);