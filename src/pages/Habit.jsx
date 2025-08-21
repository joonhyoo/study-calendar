import { useSearchParams } from 'react-router-dom';

function Habit() {
  const [searchParams] = useSearchParams();
  const id = searchParams.get('id');

  return <div className={'white-text'}>{id}</div>;
}

export default Habit;
