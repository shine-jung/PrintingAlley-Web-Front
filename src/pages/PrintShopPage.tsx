import { useState, useEffect } from 'react';
import { Box, Pagination, Stack } from '@mui/material';
import axios from 'src/utils/axios';
import { PrintShopList } from 'src/sections/PrintShop/PrintShopList';
import { SearchBar } from 'src/sections/common/SearchBar';
import CenteredTitle from 'src/sections/common/CenteredTitle';
import { GetPrintShopsResponse, PrintShopWithTags, TagInterface } from 'src/types/response.dto';
import { Helmet } from 'react-helmet-async';
import { useTag } from 'src/hooks/useTag';
import { PRINT_SHOP_PAGE_SIZE } from 'src/constants/commons';
import SortBar from 'src/sections/common/SortBar';
import FilterList from 'src/sections/Filter/FilterList';
import TagFilterDrawer from 'src/sections/Filter/TagFilterDrawer';
import { useRecoilState } from 'recoil';
import {
  searchTextState,
  selectedTopLevelTagState,
  selectedTagsState,
  sortByState,
  sortOrderState,
  currentPageState,
} from 'src/state/printShopState';

export default function PrintShopPage() {
  const { topLevelTags, tagHierarchies } = useTag();
  const [searchText, setSearchText] = useRecoilState(searchTextState);
  const [selectedTopLevelTag, setSelectedTopLevelTag] = useRecoilState(selectedTopLevelTagState);
  const [selectedTags, setSelectedTags] = useRecoilState(selectedTagsState);
  const [sortBy, setSortBy] = useRecoilState(sortByState);
  const [sortOrder, setSortOrder] = useRecoilState(sortOrderState);
  const [currentPage, setCurrentPage] = useRecoilState(currentPageState);
  const [printShops, setPrintShops] = useState<PrintShopWithTags[] | null>(null);
  const [totalPrintShops, setTotalPrintShops] = useState<number>(0);

  const fetchPrintShops = (page = 1, search = '', tags = [] as TagInterface[]) => {
    axios
      .get<GetPrintShopsResponse>('/print-shop', {
        params: {
          page,
          size: PRINT_SHOP_PAGE_SIZE,
          searchText: search,
          tagIds: tags.map((tag) => tag.id),
          sortBy,
          sortOrder,
        },
      })
      .then((response) => {
        setPrintShops(response.data.printShops);
        setTotalPrintShops(response.data.totalCount);
      });
  };

  const resetSearch = () => {
    setSearchText('');
    setSelectedTags([]);
    setSortBy('name');
    setSortOrder('ASC');
  };

  useEffect(() => {
    fetchPrintShops(currentPage, searchText, selectedTags);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, searchText, selectedTags, sortBy, sortOrder]);

  useEffect(() => {
    if (topLevelTags.length > 0) setSelectedTopLevelTag(topLevelTags[0]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [topLevelTags]);

  return (
    <Stack spacing={3} flexGrow={1}>
      <Helmet>
        <title>인쇄사 찾기 | 인쇄골목</title>
      </Helmet>

      <CenteredTitle
        title="인쇄사 찾기"
        sx={{ fontFamily: 'Godo, sans-serif', color: 'primary.main', letterSpacing: 1 }}
      />

      <SearchBar onSearch={setSearchText} resetSearch={resetSearch} />

      <Stack spacing={2}>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <TagFilterDrawer
            type="print-shop"
            selectedTopLevelTag={selectedTopLevelTag}
            selectedTags={selectedTags}
            setSelectedTags={setSelectedTags}
            tags={tagHierarchies}
          />

          <SortBar
            sortBy={sortBy}
            setSortBy={setSortBy}
            sortOrder={sortOrder}
            setSortOrder={setSortOrder}
          />
        </Stack>

        <FilterList
          selectedTopLevelTag={selectedTopLevelTag}
          selectedTags={selectedTags}
          setSelectedTags={setSelectedTags}
        />
      </Stack>

      {printShops && <PrintShopList printShops={printShops} />}

      <Box sx={{ flexGrow: 1 }} />

      <Pagination
        count={Math.ceil(totalPrintShops / PRINT_SHOP_PAGE_SIZE)}
        page={currentPage}
        onChange={(_event, value) => setCurrentPage(value)}
        variant="outlined"
        shape="rounded"
        sx={{ alignSelf: 'center' }}
        showFirstButton
        showLastButton
      />
    </Stack>
  );
}
