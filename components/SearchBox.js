import { Input, List, ListItem, IconButton, Box } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import SearchIcon from '@material-ui/icons/Search';
import { InputBase } from '@mui/material';
import { useRouter } from 'next/router';
import useStyles from '../utils/styles';
/**
 * Searchbox component
 *
 */
export default function SearchBox() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const classes = useStyles();
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    router.push(`/search?query=${query}`);
  };

  return (
    <List>
      <ListItem>
        <form className={classes.searchForm} onSubmit={handleSearchSubmit}>
          <Box>
            <InputBase
              onChange={(e) => setQuery(e.target.value)}
              name="query"
              placeholder="Search products"
              padding="0"
              className={classes.searchInput}
            ></InputBase>
            <IconButton className={classes.iconButton} type="submit">
              <SearchIcon variant="contained" />
            </IconButton>
          </Box>
        </form>
      </ListItem>
    </List>
  );
}
