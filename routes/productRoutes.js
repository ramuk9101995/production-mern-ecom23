import express from 'express'
import { isAdmin, requireSignIn } from '../middlewares/authMiddleware.js'
import { createProductController,
        updateProductController,
        deleteProductController, 
        getPhotoController, 
        getProductController,
        getSingleProdCrontroller,
        filterProductController,
        productCountController,
        productListController,
        productSearchController,
        relatedProductController,
        categoryWiseProductController,
        brainTreeTokenController ,
        braintreePaymentController} from '../controllers/productController.js'
import formidable from 'express-formidable' //for upload image package install
const router = express.Router()

//add product
router.post('/create-product',requireSignIn,isAdmin,formidable(),createProductController)

//update product
router.put('/update-product/:pid',requireSignIn,isAdmin,formidable(),updateProductController)

//Delete product
router.delete('/delete-product/:pid',requireSignIn,isAdmin,formidable(),deleteProductController)


//get all product
router.get('/get-product',getProductController)

//get product photo
router.get('/get-photo/:pid',getPhotoController)

//get single pproduct
router.get('/get-singleprod/:slug',getSingleProdCrontroller) //:after colon name is same as the req.params.colon as this case req.params.slug

//get product by filters
router.post('/product-filters',filterProductController)

//product count
router.get('/product-count',productCountController)

//product per page
router.get('/product-list/:page',productListController)

//product search controller
router.get('/search-product/:keyword',productSearchController)

//related product controller
router.get('/related-product/:pid/:cid',relatedProductController)

//category wise product return 
router.get('/product-category/:slug',categoryWiseProductController)



//payment
//braintree token
router.get('/braintree/token',brainTreeTokenController)

//braintree payment 
router.post('/braintree/payment',requireSignIn,braintreePaymentController)

export default router