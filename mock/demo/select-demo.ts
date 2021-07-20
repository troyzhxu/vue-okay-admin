import { MockMethod } from 'vite-plugin-mock';

const demoList = (keyword) => {
  const result = {
    list: [] as any[],
  };
  for (let index = 0; index < 20; index++) {
    result.list.push({
      name: `${keyword ?? ''}选项${index}`,
      id: `${index}`,
    });
  }
  return result;
};

export default [
  {
    url: '/basic-api/select/getDemoOptions',
    timeout: 1000,
    method: 'get',
    response: ({ query }) => {
      const { keyword } = query;
      console.log(keyword);
      return demoList(keyword);
    },
  },
] as MockMethod[];
