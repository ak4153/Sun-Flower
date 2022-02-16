import dynamic from 'next/dynamic';
import Loading from '../components/Loading';
/**
 * * disables SSR for a component
 * https://nextjs.org/docs/advanced-features/dynamic-import
 * server doesnt load what the client did from cookies.
 * so you need to disable SSR for this component
 * this component wont be SEO friendly because it isnt SSR
 * @param "react.Component"
 * @return "void"
 */
function dynamicSSR(Component) {
  return dynamic(() => Promise.resolve(Component), {
    ssr: false,
    loading: () => <Loading></Loading>,
  });
}

export default dynamicSSR;
