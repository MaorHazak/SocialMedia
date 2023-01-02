import React, { useState, useEffect} from 'react';
import { useParams } from 'react-router-dom';

import { searchQuery, feedQuery } from '../utils/data';
import { client } from '../client';
import MasonryLayout from './MasonryLayout';
import Spinner from './Spinner';
// import { feedQuery } from '../utils/data';


const Feed = () => {
  const [loading, setLoading] = useState(false);
  const {categoryId} = useParams();
  const [pins, setPins] = useState();

  useEffect(() => {
    setLoading(true)
    if(categoryId){
    const query = searchQuery(categoryId);
    
    client.fetch(query)
      .then((data) => {
        setPins(data);
        setLoading(false);
      })
    } else{
      client.fetch(feedQuery)
      .then((data) => {
        setPins(data);
        setLoading(false);
      })
    }
  },[categoryId])

  if(loading) return <Spinner message='We are adding new ideas...' />

  if(!pins?.length) return <h1>there is no pins yet</h1>

  return (
    <div>
      {pins && <MasonryLayout pins={pins} />}
    </div>
  )
}

export default Feed
