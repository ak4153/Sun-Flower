/* eslint-disable @next/next/no-img-element */
import React from 'react';
import Carousel from 'react-material-ui-carousel';
import { Paper, Button } from '@mui/material';
import { Typography, Link } from '@material-ui/core';

import NextLink from 'next/link';
import useStyles from '../utils/styles';
/**
 * Carousel
 * @params featuredProducts - products array
 */

export default function Carousela({ featuredProducts }) {
  const classess = useStyles();
  return (
    <Carousel animation={'slide'} className={classess.mt1}>
      {featuredProducts.map((product) => (
        <NextLink key={product._id} passHref href={`/product/${product.slug}`}>
          <Link>
            <img
              src={product.featuredImage}
              alt={product.name}
              className={classess.carouselImage}
            />
          </Link>
        </NextLink>
      ))}
    </Carousel>
  );
}
