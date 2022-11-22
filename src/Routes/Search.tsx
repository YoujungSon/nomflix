import React from 'react';
import { useSearchParams } from 'react-router-dom';

const Search = () => {
  let [searchParams, setSearchParams] = useSearchParams();

  let location = searchParams.get('keyword');

  console.log(location);
  return <div>Search</div>;
};

export default Search;
