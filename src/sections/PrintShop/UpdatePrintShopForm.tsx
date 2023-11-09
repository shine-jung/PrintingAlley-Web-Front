import { useForm } from 'react-hook-form';
import {
  TextField,
  Box,
  Alert,
  Avatar,
  Divider,
  FormLabel,
  Paper,
  Card,
  CardHeader,
  Stack,
} from '@mui/material';
import { CreatePrintShop } from 'src/types/print-shop';
import Iconify from 'src/components/iconify/iconify';
import { useSnackbar } from 'notistack';
import axios from 'src/utils/axios';
import DaumPostcode from 'react-daum-postcode';
import useFileUpload from 'src/hooks/useFileUpload';
import useLatLng from 'src/hooks/useLatLng';
import LoadingButton from '@mui/lab/LoadingButton';
import { PrintShopDetail } from 'src/types/response.dto';
import { FileUploadButton } from '../common/FileUploadButton';

const postCodeStyle = {
  height: '450px',
};

interface UpdatePrintShopFormProps {
  printShop: PrintShopDetail;
  onAddSuccess: () => void;
}

export const UpdatePrintShopForm = ({ printShop, onAddSuccess }: UpdatePrintShopFormProps) => {
  const {
    name,
    address,
    phone,
    email,
    homepage,
    representative,
    logoImage,
    backgroundImage,
    latitude,
    longitude,
    introduction,
  } = printShop;
  const { enqueueSnackbar } = useSnackbar();
  const {
    handleSubmit,
    register,
    setValue,
    setFocus,
    formState: { errors, isSubmitting },
  } = useForm<CreatePrintShop>({
    mode: 'onChange',
    defaultValues: {
      name,
      address,
      phone,
      email,
      homepage,
      representative,
      logoImage,
      backgroundImage,
      latitude,
      longitude,
      introduction,
    },
  });

  const {
    handleFileChange: handleLogoFileChange,
    uploadFile: uploadLogoFile,
    previewUrl: logoPreviewUrl,
  } = useFileUpload(logoImage);
  const {
    handleFileChange: handleBackgroundFileChange,
    uploadFile: uploadBackgroundFile,
    previewUrl: backgroundPreviewUrl,
  } = useFileUpload(backgroundImage);
  const { setLatLngFromAddress } = useLatLng();

  const handleFormSubmit = async (data: CreatePrintShop) => {
    const logoUrl = await uploadLogoFile();
    const backgroundUrl = await uploadBackgroundFile();

    const formDataWithImages = {
      ...data,
      logoImage: logoUrl ?? logoImage,
      backgroundImage: backgroundUrl ?? backgroundImage,
    };

    axios
      .put<CreatePrintShop>(`print-shop/${printShop.id}`, formDataWithImages)
      .then(() => {
        enqueueSnackbar('인쇄사가 성공적으로 업데이트 되었습니다.', { variant: 'success' });
        onAddSuccess();
      })
      .catch((error) => {
        enqueueSnackbar(`인쇄사 업데이트 중 오류가 발생했습니다. ${error.message}`, {
          variant: 'error',
        });
      });
  };

  const onCompletePost = (data: any) => {
    setValue('address', data.address);
    setLatLngFromAddress(data.address, setValue);
    setFocus('address');
  };

  return (
    <Box component="form" onSubmit={handleSubmit(handleFormSubmit)}>
      <Stack spacing={3} my={3}>
        <Card>
          <CardHeader title="인쇄사 기본 정보" />
          <Stack spacing={3} sx={{ p: 3 }}>
            <TextField
              {...register('name', {
                required: '상호명은 필수입니다.',
                minLength: {
                  value: 2,
                  message: '상호명은 2글자 이상이어야 합니다.',
                },
                maxLength: {
                  value: 50,
                  message: '상호명은 50글자 이하여야 합니다.',
                },
              })}
              label="상호명"
              placeholder="인쇄사 상호명을 입력하세요"
              error={Boolean(errors.name)}
              helperText={errors.name?.message}
            />
            <TextField
              {...register('representative', {
                required: '대표자는 필수입니다.',
                minLength: {
                  value: 2,
                  message: '대표자는 2글자 이상이어야 합니다.',
                },
                maxLength: {
                  value: 20,
                  message: '대표자는 20글자 이하여야 합니다.',
                },
              })}
              label="대표자"
              placeholder="인쇄사의 대표자 이름을 입력하세요"
              error={Boolean(errors.representative)}
              helperText={errors.representative?.message}
            />
            <TextField
              {...register('phone', { required: '전화번호는 필수입니다.' })}
              label="전화번호"
              placeholder="인쇄사의 전화번호를 입력하세요"
              error={Boolean(errors.phone)}
              helperText={errors.phone?.message}
            />
            <TextField
              {...register('email', { required: '이메일은 필수입니다.' })}
              type="email"
              label="이메일"
              placeholder="인쇄사의 이메일을 입력하세요"
              error={Boolean(errors.email)}
              helperText={errors.email?.message}
            />
            <TextField
              {...register('homepage')}
              type="url"
              label="홈페이지"
              placeholder="인쇄사의 홈페이지 주소를 입력하세요"
              error={Boolean(errors.homepage)}
              helperText={errors.homepage?.message}
            />
            <TextField
              {...register('introduction', {
                required: '소개글은 필수입니다.',
                minLength: {
                  value: 2,
                  message: '소개글은 2글자 이상이어야 합니다.',
                },
                maxLength: {
                  value: 2000,
                  message: '소개글은 2000글자 이하여야 합니다.',
                },
              })}
              label="소개글"
              placeholder="인쇄사에 대한 소개글을 입력하세요"
              error={Boolean(errors.introduction)}
              helperText={errors.introduction?.message}
              multiline
              rows={4}
            />
          </Stack>
        </Card>

        <Card>
          <CardHeader title="상품 이미지 등록" />
          <Stack spacing={3} sx={{ p: 3 }}>
            <Paper
              variant="outlined"
              sx={{
                padding: '16.5px 14px',
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
              }}
            >
              <FormLabel>로고 이미지</FormLabel>
              {logoPreviewUrl && (
                <Avatar
                  src={logoPreviewUrl}
                  alt="Logo Preview"
                  sx={{ width: '100%', height: 'auto' }}
                  variant="rounded"
                />
              )}
              <FileUploadButton onChange={handleLogoFileChange}>로고 이미지 선택</FileUploadButton>
            </Paper>
            <Paper
              variant="outlined"
              sx={{
                padding: '16.5px 14px',
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
              }}
            >
              <FormLabel>배경 이미지</FormLabel>
              {backgroundPreviewUrl && (
                <Avatar
                  src={backgroundPreviewUrl}
                  alt="Background Preview"
                  sx={{ width: '100%', height: 'auto' }}
                  variant="rounded"
                />
              )}
              <FileUploadButton onChange={handleBackgroundFileChange}>
                배경 이미지 선택
              </FileUploadButton>
            </Paper>
          </Stack>
        </Card>

        <Card>
          <CardHeader title="상품 이미지 등록" />
          <Stack spacing={3} sx={{ p: 3 }}>
            <Paper variant="outlined" sx={{ overflow: 'hidden' }}>
              <Box sx={{ p: '14px' }}>
                <Alert severity="info">
                  여기서 주소를 검색하면 아래에 주소가 자동으로 입력됩니다.
                </Alert>
              </Box>
              <Divider />
              <DaumPostcode
                style={postCodeStyle}
                onComplete={onCompletePost}
                autoClose={false}
                focusInput={false}
              />
            </Paper>

            <TextField
              {...register('address', {
                required: '주소는 필수입니다.',
                minLength: {
                  value: 2,
                  message: '주소는 2글자 이상이어야 합니다.',
                },
                maxLength: {
                  value: 200,
                  message: '주소는 200글자 이하여야 합니다.',
                },
              })}
              label="주소"
              placeholder="인쇄사의 주소를 입력하세요"
              error={Boolean(errors.address)}
              helperText={errors.address?.message}
            />

            <Stack direction="row" spacing={2}>
              <TextField
                {...register('latitude', {
                  required: '위도는 필수입니다.',
                  pattern: {
                    value: /^[-]?[0-9]+([.][0-9]+)?$/,
                    message: '위도 형식이 올바르지 않습니다.',
                  },
                })}
                label="위도"
                placeholder="인쇄사의 위도를 입력하세요"
                error={Boolean(errors.latitude)}
                helperText={errors.latitude?.message}
                InputProps={{ readOnly: true }}
                fullWidth
              />
              <TextField
                {...register('longitude', {
                  required: '경도는 필수입니다.',
                  pattern: {
                    value: /^[-]?[0-9]+([.][0-9]+)?$/,
                    message: '경도 형식이 올바르지 않습니다.',
                  },
                })}
                label="경도"
                placeholder="인쇄사의 경도를 입력하세요"
                error={Boolean(errors.longitude)}
                helperText={errors.longitude?.message}
                InputProps={{ readOnly: true }}
                fullWidth
              />
            </Stack>
          </Stack>
        </Card>

        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <LoadingButton
            sx={{ gridColumn: '1 / span 2' }}
            type="submit"
            size="large"
            startIcon={<Iconify icon="ic:baseline-edit" />}
            color="primary"
            variant="contained"
            loading={isSubmitting}
          >
            수정하기
          </LoadingButton>
        </Box>
      </Stack>
    </Box>
  );
};
