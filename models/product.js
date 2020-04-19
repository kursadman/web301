const products=
{
    fakeDB:[],

    init()
    {

        this.fakeDB.push({title:'XPS 13',description:`Our smallest 13-inch laptops feature a virtually 
        borderless InfinityEdge display and up to 10th gen Intel® processors. 
        Touch, silver, rose gold and frost options available
        `,price:`1349.99`, img: 'computer_prd'});
    
         this. fakeDB.push({title:'XPS 15',description:`Powerhouse performance with the latest processors and NVIDIA 
        graphics paired with a stunning 4K Ultra HD display. `,price:`1749.99`, img: 'computer_prd'});
    
        this.fakeDB.push({title:'XPS 17',description:`XPS 17 is designed to keep you entertained for more than 9 hours 
        with a 9-cell battery upgrade.`,price:`1949.99`, img: 'computer_prd'});

        this.fakeDB.push({title:'HP envy 13',description:`Experience peace of mind, no matter where your day takes you. Light, powerful, 
        and with smart security features – the HP ENVY 13" Laptop is built to empower life on-the-go. With state-of-the-art security, an ultra-sleek design, 
        and powerful entertainment features, your privacy and data stays secure`,price:`1299.99`, img: 'hp'});
        
        this.fakeDB.push({title:'HP envy 15',description:`With a stunning flush glass touchscreen, Full HD1 display, and Beats Audio, 
        the HP ENVY15 TouchSmart is the perfect combination of entertainment, power and design.`,price:`1649.99`, img: 'hp'});

        this.fakeDB.push({title:'HP envy 17',description:`HP’s Envy 17 is a 17.3-inch multimedia notebook equipped with a ULV quad-core processor.
        It is somewhat gaming-capable thanks to its dedicated GeForce GPU. `,price:`1999.99`, img: 'hp'});
    },

    getAllProducts()
    {

        return this.fakeDB;
    }

}

products.init();
module.exports=products;