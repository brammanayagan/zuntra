import Masonry from "react-masonry-css";
import "./MasonryGrid.css"; // We'll add styles to center columns

const MasonryGrid = ({ children }) => {
  const breakpointColumnsObj = {
    default: 6, // Widescreen
    2000: 5,
    1600: 4,
    1200: 3,
    800: 2,
    480: 1, // Mobile
  };

  return (
    <Masonry
      breakpointCols={breakpointColumnsObj}
      className="my-masonry-grid"
      columnClassName="my-masonry-grid_column"
    >
      {children}
    </Masonry>
  );
};

export default MasonryGrid;
