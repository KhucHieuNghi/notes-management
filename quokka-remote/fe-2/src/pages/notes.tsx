import dynamic from "next/dynamic";

const TLDrawClient = dynamic(() => import("~/components/TLDraw"), {
  ssr: false,
});
const Notes = () => {
  return <TLDrawClient />;
};

export default Notes;
