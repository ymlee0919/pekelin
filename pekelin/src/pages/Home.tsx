//import { BsSearch } from "react-icons/bs";
import { FaHandshake } from "react-icons/fa";
import { GiSewingMachine } from "react-icons/gi";
import { IoMdHeart } from "react-icons/io";
import { TbTruckDelivery } from "react-icons/tb";

import db from "../database/db";
import { CategoryInfo } from "../database/database.types";
import ProductCard from "../components/cards/ProductCard";
import VariantCard from "../components/cards/VariantCard";
import CategoryCard from "../components/cards/CategoryCard";
import StepCard from "../components/cards/StepCard";
import { MdLocationPin, MdOutlineWhatsapp } from "react-icons/md";
import ReviewCarousel from "../components/review/ReviewCarousel";
import { BsSearch } from "react-icons/bs";

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
                <h1 className="mb-10 text-5xl font-bold">Pekelín</h1>
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
            <p className="text-center text-xl mb-5 py-5 text-sky-900">El proceso es bien simple</p>
            <div className="content-center">

            
            <div className="inline-flex flex-wrap gap-0">
                <StepCard title="Busca lo que quieres"
                    description="Busca la ropa que se acomode a tus gustos y necesidades."
                    Icon={BsSearch}
                    />

                {/*<StepCard title="Conforma tu pedido"
                    description="Busca lo que quieres y llena tu carrito de compras con ropita para tu niño."
                    Icon={MdAddShoppingCart}
                    />*/}

                <StepCard title="Déjanos saber"
                     description="Puedes usar el botón <strong>Encargar</strong> para enviarnos tu solicitud."
                     Icon={MdOutlineWhatsapp}
                     />

                <StepCard title="Nos ponemos de acuerdo"
                    description="Ajustamos los detalles que necesites. Tamaño, color, adornos, entrega, etc."
                    Icon={FaHandshake}
                    />

                <StepCard title="Elaboramos"
                    description="Confeccionamos la ropa con lujo de detalles y de acuerdo a tus necesidades."
                    Icon={GiSewingMachine}
                    />
                
                <StepCard title="Entregamos"
                    description="El fin de la espera. Te hacemos llegar la ropa según acordemos."
                    Icon={TbTruckDelivery}
                    />
                
                <StepCard title="Disfruta con tu bebé!"
                    description="El momento más esperado, ver la elegancia y belleza de tu preciado tesoro"
                    Icon={IoMdHeart}
                    />
            </div>
            </div>

            <div className="text-center content-center pt-4">
                <div className="mt-7 lg:flex block p-3 text-slate-500">
                    <div className="rounded-full bg-sky-500 p-3 lg:flex-none inline-flex">
                        <MdLocationPin className="text-blue-200 text-xl" />
                    </div> 
                    <span className="pt-1 pl-2 text-center content-center">
                        Disponibles en: 
                        <ul className="lg:inline-flex block">
                            <li className="px-2">San José de las Lajas</li>
                            <li className="px-2">Güines</li>
                            <li className="px-2">Jaruco</li>
                            <li className="px-2">Madruga</li>
                            <li className="px-2">Santa Cruz del Norte</li>
                        </ul>
                    </span>
                </div>
            </div>
            
        </div>
            
        <div className="py-16 px-5 bg-base-300">
            <p className="text-center text-2xl mt-1 mb-8 text-sky-900">Nuestras ofertas</p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 justify-center">
                {db.Categories.map((category: CategoryInfo) => {
                    return <CategoryCard key={category.categoryId} category={category} />
                })}
            </div>
        </div>

        <ReviewCarousel />

        <div className="p-5 mb-12">
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