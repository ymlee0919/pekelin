const Loading = () => {
    return <>
        <div className="show bg-white position-fixed translate-middle w-100 vh-100 top-50 start-50 flex align-items-center justify-content-center">
            <div className="content text-center justify-center">
                <span className="loading loading-spinner loading-lg text-blue-500"></span>
                <br></br>
                Cargando datos ...
            </div>
        </div>
    </>;
};

export default Loading;