// scrollbar
import 'simplebar-react/dist/simplebar.min.css';

// image
import 'react-lazy-load-image-component/src/effects/blur.css';

// ----------------------------------------------------------------------

// theme
import ThemeProvider from 'src/theme';
// components
import ProgressBar from 'src/components/progress-bar';
import SnackbarProvider from 'src/components/snackbar/snackbar-provider';
import { Routes, Route } from 'react-router-dom';
import Navbar from './sections/Navbar';
import Home from './pages/HomePage';
import PrintShop from './pages/PrintShopPage';
import PrintShopDetailPage from './pages/PrintShopDetailPage';
import NewPrintShopPage from './pages/NewPrintShopPage';
import LoginPage from './pages/LoginPage';
import PageContainer from './sections/common/PageContainer';

// ----------------------------------------------------------------------

export default function App() {
  return (
    <ThemeProvider>
      <SnackbarProvider>
        <ProgressBar />
        <Navbar />
        <PageContainer>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/print-shop" element={<PrintShop />} />
            <Route path="/print-shop/:id" element={<PrintShopDetailPage />} />
            <Route path="/print-shop/new" element={<NewPrintShopPage />} />
            <Route path="/bookmark" element={<Home />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="*" element={<Home />} />
          </Routes>
        </PageContainer>
      </SnackbarProvider>
    </ThemeProvider>
  );
}
