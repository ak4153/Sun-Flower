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
} from '@material-ui/core';
import NextLink from 'next/link';
import dynamicSSR from '../utils/dynamicFunction';
import db from '../utils/db';

import handleAddToCartFuncion from '../utils/handleAddToCart';
import { useRouter } from 'next/router';
import { useContext, useState } from 'react';
import { Store } from '../utils/Store';
import { Alert, AlertTitle } from '@material-ui/lab';
import useStyles from '../utils/styles';
//props are coming from getServerSideProps
function Home(props) {
  const { products } = props;
  const { state, dispatch } = useContext(Store);
  const router = useRouter();
  const [alert, setAlert] = useState('');
  const classess = useStyles();
  return (
    <div>
      <Layout>
        {alert.message && (
          <Alert className={classess.section} severity={alert.variant}>
            <AlertTitle>Error</AlertTitle>
            {alert.message}
          </Alert>
        )}
        <Grid container spacing={3} className={classess.section}>
          {/*grid item will have 4 products
             for line on medium devices*/}
          {products.map((product) => (
            <Grid item md={4} key={product.name}>
              <Card>
                <NextLink href={`/product/${product.slug}`} passHref>
                  {/*CardActionArea will be converted to an <a></a>
                   and NextLink will pass a link to it
                    */}
                  <CardActionArea>
                    <CardMedia
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
          ))}
        </Grid>
      </Layout>
    </div>
  );
}
//this function will be pre-rendered on each request using the data returned by it
//data us accessible as props
export async function getServerSideProps() {
  await db.connect();
  var products = await Product.find({}).lean();
  //pay close attention to .lean() which converts the document from mongodb
  //to a smaller javascript object
  //then we need to convert the _id,createdAt,updatedAt fields to string from plain objects
  //only numbers,string and bool are applicable

  await db.disconnect();
  return {
    props: {
      products: products.map((product) => db.convertDocToObj(product)),
    },
  };
}

export default dynamicSSR(Home);
