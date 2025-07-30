import LoadingSpinner from "@/components/common/loading-spinner";

const LoadingPage = ()=> {
    return (
        <div className="flex justify-center items-center h-lvh">
          <LoadingSpinner title="Fetching data.."/>
        </div>
      );
}

export default LoadingPage;