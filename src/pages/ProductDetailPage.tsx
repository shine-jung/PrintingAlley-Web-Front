import { Avatar, Box, ButtonGroup, Chip, Divider, Grid, Link, Typography } from '@mui/material';
import axios from 'src/utils/axios';
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import SkeletonSection from 'src/sections/common/SkeletonSection';
import { useTag } from 'src/hooks/useTag';
import CenteredTitle from 'src/sections/common/CenteredTitle';
import {
  GetProductResponse,
  GetProductReviewsResponse,
  ProductDetail,
  ProductReviewWithUser,
} from 'src/types/response.dto';
import ProductDetailsCarousel from 'src/sections/Product/ProductDetailsCarousel';
import useAuth from 'src/hooks/useAuth';
import { NavLink } from 'react-router-dom';
import { DeleteProductButton } from 'src/sections/Product/DeleteProductButton';
import { UpdateProductDialog } from 'src/sections/Product/UpdateProductDialog';
import NavigateBackButton from 'src/sections/common/NavigateBackButton';
import { ReviewSection } from 'src/sections/Review/ReviewSection';

function ProductInformation({ product }: { product: ProductDetail }) {
  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={4}>
        <Avatar
          alt="Logo"
          src={product.mainImage}
          sx={{ width: 1, height: 'auto' }}
          variant="rounded"
        />
      </Grid>
      <Grid
        item
        xs={12}
        md={8}
        sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}
      >
        <Typography variant="subtitle1" color="textSecondary">
          {product.category.name}
        </Typography>
        <Divider sx={{ my: 0.5 }} />
        <Typography>
          <b>제작 인쇄사</b>{' '}
          <Link component={NavLink} to={`/print-shop/${product.printShop.id}`}>
            {product.printShop.name}
          </Link>
        </Typography>
        <Divider sx={{ my: 0.5 }} />
        <Typography>
          <b>디자인</b> {product.designer}
        </Typography>
        <Divider sx={{ my: 0.5 }} />
        <Typography>
          <b>제품 크기</b> {product.size}
        </Typography>
        <Divider sx={{ my: 0.5 }} />
        <Typography>
          <b>종이</b> {product.paper}
        </Typography>
        <Divider sx={{ my: 0.5 }} />
        <Typography>
          <b>인쇄 방식</b> {product.tags.map((tag) => tag.name).join(', ')}
        </Typography>
        <Divider sx={{ my: 0.5 }} />
        <Typography>
          <b>후가공</b> {product.afterProcess}
        </Typography>
        <Divider sx={{ my: 0.5 }} />
        <Typography>{product.introduction}</Typography>
      </Grid>
    </Grid>
  );
}

export default function ProductDetailPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { topLevelTags, tagHierarchies } = useTag();
  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [reviews, setReviews] = useState<ProductReviewWithUser[]>([]);

  const fetchProduct = () => {
    axios.get<GetProductResponse>(`/product/${id}`).then((response) => {
      setProduct(response.data.product);
    });
  };

  const fetchReviews = () => {
    axios.get<GetProductReviewsResponse>(`/product/${id}/review`).then((response) => {
      setReviews(response.data.productReviews);
    });
  };

  const onAdd = () => {
    fetchProduct();
  };

  const onDelete = () => {
    navigate('/product', { replace: true });
  };

  useEffect(() => {
    fetchProduct();
    fetchReviews();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  return (
    <>
      {product ? (
        <div>
          <NavigateBackButton />

          <CenteredTitle title={product.name} />

          <ProductInformation product={product} />

          <Divider sx={{ my: 2 }} />

          <Typography variant="body2" sx={{ textAlign: 'center', whiteSpace: 'pre-wrap' }}>
            {product.description}
          </Typography>

          <Divider sx={{ my: 2 }} />

          <ProductDetailsCarousel images={product.images} />

          <Divider sx={{ my: 2 }} />

          <Box>
            <Typography variant="h6" gutterBottom>
              태그
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {product.tags?.map((tag) => <Chip key={tag.id} label={tag.name} />)}
            </Box>
          </Box>

          <Divider sx={{ my: 2 }} />

          <ReviewSection
            type="product"
            targetId={product.id}
            reviews={reviews}
            currentUser={user}
            fetchReviews={fetchReviews}
          />

          <Box sx={{ height: 64 }} />

          <ButtonGroup color="inherit">
            <UpdateProductDialog
              product={product}
              topLevelTags={topLevelTags}
              tagHierarchies={tagHierarchies}
              onAdd={onAdd}
            />
            <DeleteProductButton product={product} onDelete={onDelete} />
          </ButtonGroup>
        </div>
      ) : (
        <SkeletonSection />
      )}
    </>
  );
}
