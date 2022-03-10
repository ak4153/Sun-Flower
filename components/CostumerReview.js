import React, { useContext, useEffect, useReducer, useState } from 'react';
import {
  Link,
  Grid,
  List,
  ListItem,
  Typography,
  Card,
  Button,
  TextField,
  CircularProgress,
} from '@material-ui/core';
import axios from 'axios';
import Error from './Error';
import ReactStars from 'react-rating-stars-component';
import { Store } from '../utils/Store';
import { StarRating } from 'react-star-rating-element';
import dynamicSSR from '../utils/dynamicFunction';
const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST': {
      return { ...state, loading: true, error: '' };
    }
    case 'FETCH_SUCCESS': {
      return {
        ...state,
        loading: false,
        error: '',
        reviews: action.payload,
      };
    }
    case 'FETCH_FAIL': {
      return { ...state, loading: false, error: action.payload };
    }
    case 'POST_REQUEST': {
      return { ...state, postLoading: true, postError: '' };
    }
    case 'POST_SUCCESS': {
      return {
        ...state,
        postLoading: false,
        postError: '',
      };
    }
    case 'POST_FAIL': {
      return { ...state, postLoading: false, postError: action.payload };
    }

    case 'DELETE_REQUEST': {
      return { ...state, deleteLoading: true, deleteError: '' };
    }
    case 'DELETE_SUCCESS': {
      return {
        ...state,
        deleteLoading: false,
        deleteError: '',
      };
    }
    case 'DELETE_FAIL': {
      return { ...state, deleteLoading: false, deleteError: action.payload };
    }
    default:
      break;
  }
};
/** displays reviews for a product
 * @param review object
 */
function CostumerReview({ productId }) {
  const [
    {
      reviews,
      loading,
      error,
      postLoading,
      postError,
      deleteLoading,
      deleteError,
    },
    dispatch,
  ] = useReducer(reducer, {
    reviews: [],
    loading: false,
    error: '',
    postLoading: false,
    postError: '',
    deleteLoading: false,
    deleteError: '',
  });
  const [comment, setComment] = useState('');
  const [rating, setRating] = useState(null);
  const { state } = useContext(Store);
  const { user } = state;
  useEffect(() => {
    dispatch({ type: 'FETCH_REQUEST' });
    axios
      .get(`/api/reviews/${productId}`)
      .then((result) => {
        dispatch({ type: 'FETCH_SUCCESS', payload: result.data });
      })
      .catch((err) => dispatch({ type: 'FETCH_FAIL', payload: err.message }));
  }, [postLoading, deleteLoading]);

  function handleReviewSubmit(e) {
    e.preventDefault();

    if (comment.length > 0 && rating) {
      dispatch({ type: 'POST_REQUEST' });
      let exisitingReview = null;
      reviews.map((review) => {
        if (review.emailOfReviewer === user.email)
          return (exisitingReview = review._id);
      });

      axios
        .post(
          '/api/reviews',
          {
            nameOfReviewer: user.name,
            review: comment,
            stars: rating,
            productId: productId,
            emailOfReviewer: user.email,
            exisitingReview: exisitingReview,
          },
          {
            headers: { Authorization: `Bearer ${user.token}` },
          }
        )
        .then((result) => {
          console.log('post', result.data);
          dispatch({ type: 'POST_SUCCESS' });
        })
        .catch((err) => dispatch({ type: 'POST_FAIL', payload: err.message }));
    } else {
      dispatch({ type: 'POST_FAIL', payload: 'Fill in the Comment/Rating' });
    }
  }
  const handleReviewDelete = (_id) => {
    dispatch({ type: 'DELETE_REQUEST' });
    axios
      .delete(
        '/api/reviews',
        { data: { reviewId: _id } },
        {
          headers: { Authorization: `Bearer ${user.token}` },
        }
      )
      .then((result) => {
        dispatch({ type: 'DELETE_SUCCESS' });
      })
      .catch((err) => {
        dispatch({ type: 'DELETE_FAIL', payload: err.message });
      });
  };
  return (
    <form onSubmit={(e) => handleReviewSubmit(e)}>
      <Error message={error || postError} severity="error"></Error>
      {loading && <CircularProgress />}
      <Grid container spacing={2}>
        {reviews.map((review) => (
          <Grid item xs={6} key={review._id}>
            <Card>
              <Grid container spacing={3} alignItems="center">
                <Grid item xs={3}>
                  <List>
                    <ListItem>Author: {review.nameOfReviewer}</ListItem>
                    <ListItem>Date: {review.createdAt}</ListItem>
                  </List>
                </Grid>

                <Grid item xs={3}>
                  <List>
                    <ListItem>
                      <StarRating
                        ratingValue={review.stars}
                        changeRating={() => review.stars}
                      />
                    </ListItem>
                    <ListItem>{review.review}</ListItem>
                  </List>
                </Grid>
                <Grid item>
                  {user.email === review.emailOfReviewer && (
                    <Button
                      onClick={() => handleReviewDelete(review._id)}
                      variant="contained"
                      color="secondary"
                    >
                      Delete Comment
                    </Button>
                  )}
                </Grid>
              </Grid>
            </Card>
          </Grid>
        ))}

        <Grid item xs={12}>
          <Grid container>
            <Grid item xs={12}>
              <Typography variant="h2" component="h2">
                Leave Your Comment
              </Typography>
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                id="comment"
                label="Comment..."
                fullWidth
                variant="outlined"
                type="text"
                error={comment.length < 1}
                onChange={(e) =>
                  setComment((prevState) => (prevState = e.target.value))
                }
              />
            </Grid>
          </Grid>
        </Grid>

        <Grid item xs={12}>
          <ReactStars
            count={5}
            onChange={(newRating) =>
              setRating((prevState) => (prevState = newRating))
            }
            size={24}
            activeColor="#ffd700"
          />
        </Grid>
        <Grid item xs={12} md={6}>
          {postLoading ? (
            <CircularProgress />
          ) : (
            <Button variant="contained" color="primary" fullWidth type="submit">
              COMMENT
            </Button>
          )}
        </Grid>
      </Grid>
    </form>
  );
}
export default dynamicSSR(CostumerReview);
