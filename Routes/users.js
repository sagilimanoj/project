const express=require("express");
const {users}=require("../data/users.json");
const router=express.Router();

//Get all User Details
router.get("/",(req,res)=>{
    res.status(200).json({
        success:true,
        data:users,
    });
});

// Gets User details by ID
router.get("/:id",(req,res)=>{
    //const id=req.params.id; any one
    const {id}=req.params;
    // console.log(id);
    const user=users.find(each=>each.id==id);
    if(!user){
        return res.status(404).json({
            success:false,
            message:"User Does not exist",
        });

    }
    return res.status(200).json({
        success:true,
        message:"User Found",
        data:user,
    })
})


// Creating or Adding a user
router.post("/",(req,res)=>{
    const {id,name,surname,email,subscriptionType,subscriptionDate}=req.body
    const user=users.find(each=>each.id===id);
    if (user){ 
        return res.status(404).json({
            success:false,
            messsage:"User with ID already exists in Server",
        });
    }else{
    users.push({
        id,name,surname,email,subscriptionType,subscriptionDate

    });
    return res.status(200).json({
        success:true,
        message:"User Added",
        data:users
    });   
}
});


// Updating the data
router.put("/:id",(req,res)=>{
    const {id}=req.params;
    const {data}=req.body;
    const user=users.find(each=>each.id===id);
    if(!user){
        return res.status(404).json({
            success:false,
            message:"User Does not exist",
        });
    }
    else{
        const updateUserData=users.map((each)=>{
            if (each.id==id){
                return {
                    ...each,...data,
                }
            }
            else{
                return each;
            }
        });
        return res.status(200).json({
            success:true,
            message:"Update Successful",
            data:updateUserData,
              
        });
    }
    
});


router.delete("/:id",(req,res)=>{
    const {id}=req.params;
    const user=users.find(each=>each.id===id);
    if(!user){
        return res.status(404).json({
            success:false,
            message:"User Does not exist",
        });
    }
    else{
    const index=users.indexOf(user);
    users.splice(index,1);
    return res.status(200).json({
        success:true,
        message:"Deleted the User",
        data:users
    });
}

})



router.get("/subscriptionDetails/:id",(req,res)=>{
    const {id}=req.params;
    const user=users.find((each)=>each.id === id);
    if (!user){
        return res.status(404).json({
            success:false,
            message:"Id Doesnt Exist"
        });
    }
    else{
        const GetDateInDays=(data="")=>{
            let date;
            if (data===""){
                date=new Date();
            }
            else{
                date=new Date(data);
            } 
            let days=Math.floor( date /(1000 * 60 * 60 * 24));
            return days;
        };

        const subscriptionType=(date)=>{
            if (user.subscriptionType === "Basic"){
                date=date+90;
            }
            else if(user.subscriptionType=== "Standard"){
                date=date+180;
                
            }
            else if(user.subscriptionType=== "Premium"){
                date = date+365;
            }
            return date;
        };
        let returnDate=GetDateInDays(user.returnDate);
        let currentDate=GetDateInDays();
        let SubscriptionDate=GetDateInDays(user.subscriptionDate);
        let subscriptionExpiration=subscriptionType(SubscriptionDate);
        

        const data={
            ...user,
            isSubscriptionExpired : subscriptionExpiration<currentDate,
            daysLeftForExpiration:
                subscriptionExpiration<=currentDate
                ? 0 
                : subscriptionExpiration-currentDate,

            fine:
                returnDate<currentDate?
                subscriptionExpiration<=currentDate?
                100:50:0,  
        
        };
        return res.status(200).json({
            success:true,
            message:"User with id Subscription Details are",
            data
        })

    }
})

router.get("*",(req,res)=>{
    res.status(404).json({
        message:"Route does not exist"
    });
});


module.exports=router;