import express from 'express'
import { createCategoryController,updateCategoryController,fetchCategoryController,getSingleCategoryController,deleteCategoryController } from '../controllers/createCategoryController.js'
import { isAdmin, requireSignIn } from '../middlewares/authMiddleware.js'


const router = express.Router()

//create category
router.post('/create-category',requireSignIn,isAdmin,createCategoryController)

//category update
router.put('/update-category/:id',requireSignIn,isAdmin,updateCategoryController)

//category delete
router.delete('/delete-category/:id',requireSignIn,isAdmin,deleteCategoryController)

//category fetch
router.get('/category-all',fetchCategoryController)

//single category not for admin thats why not use the isadmin and require singin
router.get('/getcategory/:slug',getSingleCategoryController)

export default router
