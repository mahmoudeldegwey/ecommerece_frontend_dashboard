"use client";
import React from 'react'
import  { useSession } from 'next-auth/react'
import { useState, useEffect } from 'react'
import { productReviewsList } from '@/utils/actions/product-reviews/actions'
import ListTable from './Table'

interface Meta {
  current_page: number;
  from: number;
  last_page: number;
  path: string;
  per_page: number;
  to: number;
  total: number;
}

interface ProductReview {
  id: number;
  username: string;
  phone_number: string;
  email: string;
  image: string;
  rate: string;
  message: string;
  created_at: string;
  status: string;
  product?: {
    id: number;
    name: string;
  };
  
}

interface ParamsSearch {
  name?: string;
}

interface CustomSession {
  user?: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
    token?: string;
  };
}

const ProductReviews = () => {

      const { data: session } = useSession() as { data: CustomSession };
      
      const [productReviews, setProductReviews] = useState<ProductReview[]>([]);
      const [meta, setMeta] = useState<Meta>({ 
        current_page: 1,
        from: 0,
        last_page: 1,
        path: '',
        per_page: 10,
        to: 0,
        total: 0
      });
    
      const getProductReviewsList = (page: number = 1, params: ParamsSearch = {}) => {
        if (session?.user?.token) {
          productReviewsList(session.user.token, page, params).then(result => {
            console.log("Product Reviews List:", result);
            setProductReviews(result.data);
            setMeta(result.meta)
          });
        }
      }
    
      useEffect(() => {   
        if (session?.user?.token) {
          getProductReviewsList()
        }
      }, [session]);
    


    return (
        <div>
            <ListTable productReviews={productReviews} meta={meta} refreshProductReviewsList={getProductReviewsList} />
        </div>
    );
}

export default ProductReviews;