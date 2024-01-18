import React from "react";
import ReactPaginate from "react-paginate";

const Pagination = (props) => {
  const { pages, handlePageClick, page = 1 } = props;
  return (
    <ReactPaginate
      previousLabel={"previous"}
      nextLabel={"next"}
      breakLabel={<span className="mr-4">...</span>}
      pageCount={pages}
      marginPagesDisplayed={1}
      pageRangeDisplayed={5}
      onPageChange={handlePageClick}
      containerClassName={"flex items-center justify-center mt-8 mb-4"}
      pageClassName={
        "block border- border-solid border-lightGray hover:bg-lightGray w-10 h-10 flex items-center justify-center rounded-md mr-4"
      }
      previousClassName={"px-5"}
      activeClassName={"bg-gray-300"}
      forcePage={page - 1}
    />
  );
};

export default Pagination;
