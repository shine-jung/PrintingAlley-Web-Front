import { useState, useEffect } from 'react';
import axios from 'src/utils/axios';
import { GetContentsResponse, ContentInterface } from 'src/types/response.dto';
import { ContentList } from 'src/sections/Content/ContentList';
import Title from 'src/sections/common/Title';

export default function ContentPage() {
  const [contents, setContents] = useState<ContentInterface[]>([]);

  const fetchContents = () => {
    axios.get<GetContentsResponse>('/content').then((response) => {
      setContents(response.data.contents);
    });
  };

  useEffect(() => {
    fetchContents();
  }, []);

  return (
    <div>
      <Title title="인쇄가 어려운 당신에게" />
      <ContentList contents={contents} />
    </div>
  );
}
