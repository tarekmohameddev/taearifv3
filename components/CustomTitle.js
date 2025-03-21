// components/CustomTitle.js
import Head from 'next/head';

const CustomTitle = ({ title }) => {
  return (
    <Head>
      <title>{title}</title>
    </Head>
  );
};

export default CustomTitle;
