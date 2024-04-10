class Response{
    constructor(data=null, message=null){
        this.data=data;
        this.message=message;
    };

    success(res){
        return res.status(200).json({
            success: true,
            data: this.data,
            message: this.message ?? "Transaction successful",
        });
    };

    created(res){
        return res.status(201).json({
            success:true,
            data: this.data,
            message: this.message ?? "Create transaction completed successfully"
        });
    };

    error400(res){
        return res.status(400).json({
            success: false,
            message: this.message ?? "Bad Request"
        });
    };
    
    error401(res){
        return res.status(401).json({
            success: false,
            message: this.message ?? "Unauthorized. Please Log in with an authorized account"
        })
    };

    error404(res){
        return res.status(404).json({
            success: false,
            message: this.message ?? "404 Not Found"
        });
    };

    error429(res){
        return res.status(429).json({
            success: false,
            message: this.message ?? "Many Requests"
        });
    };

    
    error500(res){
        return res.status(500).json({
            success: false,
            message: this.message ?? "Transaction failed" 
        });
    }; 
};

module.exports=Response;