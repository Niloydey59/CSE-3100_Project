// Components
import GroupCard from "./groupsCard";

const GroupList = ({ groups, setGroups, setPage, pagination }) => {
  const handlePreviousPage = () => {
    if (pagination.currentPage > 1) {
      setPage((prevPage) => prevPage - 1);
    }
  };

  const handleNextPage = () => {
    if (pagination.nextPage) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  return (
    <div className="group-list">
      {/* Render the list of groups */}
      {groups.length > 0 ? (
        groups.map((group) => <GroupCard key={group._id} group={group} />)
      ) : (
        <p>No groups available. Be the first to create one!</p>
      )}

      {/* Pagination Controls */}
      <div className="pagination-controls">
        <button
          onClick={handlePreviousPage}
          disabled={!pagination.previousPage}
          className="pagination-button"
        >
          Previous
        </button>
        <span className="pagination-info">
          Page {pagination.currentPage} of {pagination.totalPages}
        </span>
        <button
          onClick={handleNextPage}
          disabled={!pagination.nextPage}
          className="pagination-button"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default GroupList;
