import { BsMessenger, BsSearch } from "react-icons/bs";
import { FaHandshake } from "react-icons/fa";
import { GiSewingMachine } from "react-icons/gi";
import { IoMdHeart } from "react-icons/io";
import { TbTruckDelivery } from "react-icons/tb";

import db from "../database/db";
import { CategoryInfo } from "../database/database.types";
import ProductCard from "../components/ProductCard";
import VariantCard from "../components/VariantCard";
import CategoryCard from "../components/CategoryCard";

const Home = () => {
    return <>
        <div
            className="hero min-h-screen"
            style={{
                backgroundImage: "url(/index.jpeg)",
            }}>
            <div className="hero-overlay bg-opacity-50"></div>
            <div className="hero-content text-neutral-content text-center">
                <div className="max-w-3xl">
                <h1 className="mb-10 text-5xl font-bold">Pekelin</h1>
                <p className="mb-5 text-xl">
                    <span className="text-2xl">Vista a su niña como una princesa y a su niño como un caballero.</span>
                    <br></br>
                    Ropa de calidad y confortable para su bebé.
                </p>
                </div>
            </div>
        </div>
        <p> </p>
        <br></br>
        <div className="p-5 mb-12">
            <p className="text-center text-xl mb-5 text-sky-900">El proceso es bien simple</p>
            <ul className="timeline timeline-vertical">
                <li>
                    <hr />
                    <div className="timeline-start timeline-box bg-green-100">Busca lo que quieres</div>
                    <div className="timeline-middle bg-blue-200 text-base-100 p-3 rounded-full">
                        <BsSearch className="text-xl"/>
                    </div>
                    <hr />
                </li>
                <li>
                    <hr />
                    <div className="timeline-start timeline-box bg-green-100">Déjanos saber</div>
                    <div className="timeline-middle bg-blue-300 text-base-100 p-3 rounded-full">
                        <BsMessenger className="text-xl" />
                    </div>
                    <hr />
                </li>
                <li>
                    <hr />
                    <div className="timeline-full justify-center">
                        <div className="bg-blue-400 text-base-100 p-3 rounded-full flex">
                            <FaHandshake className="text-xl my-1 mx-2" />
                            Nos ponemos de acuerdo
                        </div>    
                        
                    </div>
                </li>
                <li>
                    <hr />
                    <div className="timeline-middle bg-blue-500 text-base-100 p-3 rounded-full">
                        <GiSewingMachine className="text-xl" />
                    </div>
                    <div className="timeline-end timeline-box bg-blue-50">Hacemos su pedido</div>
                    <hr />
                </li>
                <li>
                    <hr />
                    <div className="timeline-middle bg-blue-600 text-base-100 p-3 rounded-full">
                        <TbTruckDelivery className="text-xl" />
                    </div>
                    <div className="timeline-end timeline-box bg-blue-50">Entregamos</div>
                    <hr />
                </li>
                <li>
                    <hr />
                    <div className="timeline-start timeline-box bg-yellow-100">Disfruta con tu bebé!</div>
                    <div className="timeline-middle bg-blue-800 text-base-100 p-3 rounded-full">
                        <IoMdHeart className="text-xl"/>
                    </div>
                    <hr />
                </li>  
            </ul>
            
            <div className="py-10">
                <p className="text-center text-2xl my-5 text-sky-900">Nuestras ofertas</p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 justify-center">
                    {db.Categories.map((category: CategoryInfo) => {
                        return <CategoryCard key={category.categoryId} category={category} />
                    })}
                </div>
            </div>

            {db.existsBestSeller && 
                /** Best sellers */
                <>
                    <br></br>
                    <p className="text-center text-xl my-5 text-sky-900">Lo más vendido</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5 justify-center px-5">
                    {
                        db.bestSellerProductsId.map((productId: number) => 
                            <ProductCard key={productId} product={db.getProductCardInfoById(productId)} />
                        )
                    }
                    {
                        db.bestSellerVariantsId.map((variantId: number) => 
                            <VariantCard key={variantId} variant={db.getVariantCardInfoById(variantId)} />
                        )
                    }
                    </div>
                </>
                /** END of Best seller */
            }
            
        </div>

        

    </>
}

export default Home;