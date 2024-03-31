const express=require("express");

const router=express.Router();
const {books}=require("../data/books.json");
const {users}=require("../data/users.json");

const {UserModel,BookModel}=require("../models/index.js");


//Get All Books
router.get("/",(req,res)=>{
    res.status(200).json({
        success:true,
        message:"Got all the Books",
        data:books
    });
});


//Get a book By Id
router.get("/:id",(req,res)=>{
    const {id}=req.params;
    const book=books.find(each=>each.id===id)
    if (!book){
        return res.status(404).json({
        success:false,
        messsage:"Book not Found"
    })  
        }
        return res.status(200).json({
            success:true,
            message:"Found the book",
            data:book
        })
})


//Getting All issued Books
router.get("/issuedBook/ByUser",(req,res)=>{
    const userWithIssuedBook=users.filter((each)=>{
        if (each.issuedBook)
        {
            return each;
        }
    });
    const issuedBook=[];
    userWithIssuedBook.forEach(each => {
        const book=books.find(book=>book.id===each.issuedBook);
        //const book=books.find(book=>{ return book.id===each.issuedBook});
        book.issuedBy=each.name;
        book.issuedDate=each.issuedDate;
        book.returndate=each.returnDate;
        issuedBook.push(book);
    });
    if (issuedBook.length===0){
        return res.status(404).json(
            {
                success:false,
                message:"No Issued Books"
            });

    }
    else{
        return res.status(200).json({
            success:true,
            message:"Issued Books Found",
            issuedBook:issuedBook
        });
    }
});

//Adding a book By ID
router.post("/",(req,res)=>{
    const {data}=req.body;
    if (!data){
        return res.status(404).json({
            success:false,
            message:"No Data to Add a Book"
        });

    }
    else{
    const book=books.find(each=>each.id===data.id);
    if(book){
        return res.status(404).json({
            success:false,
            message:"Book ID Already Exists",
            });
        }
    else{
        const allBooks={ ...books,data };
        return res.status(200).json({
            success:true,
            message:"Data Added to Book",
            data:allBooks
        });
    }
    }


});

router.put("/update/:id",(req,res)=>{
    const {id}=req.params;
    const {data}=req.body;
    const book=books.find((each)=>each.id===id);
    if (!book){
        return res.status(404).json({
            success:false,
            message:"No Book on This ID"
        });
    }
    else{
        const updateBookData=books.map((each)=>{
        if (each.id===id){
        return {
            ...each ,
            ...data
        };
        }
        else{
            return each;
        }
    });
    
    return res.status(200).json({
        success:true,
        message:"updated Book Successfully",
        data:updateBookData,
        })
    }
});




module.exports=router;