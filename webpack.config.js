/**
 * Created by maczhanchao on 2017/3/25.
 */
let path = require("path");

module.exports={
    entry:"./src/main.js",
    output:{
        path:path.resolve(__dirname,"dist"),
        publicPath:"/dist/",
        filename:"bundle.js"
    },
    module:{
        rules:[
            {
                test:/\.vue$/,
                use:["vue-loader"]
            },
            {
                test:/\.js$/,
                exclude:/node_modules/,
                use:{
                    loader:"babel-loader",
                    options:{
                        presets:["es2015"]
                    }
                }
            },
            {
                test:/\.(png|jpg|gif|svg)$/,
                use:{
                    loader:"url-loader",
                    options:{
                        limit:8192,
                        name:"[name].[ext]?[hash]",
                    }
                }
            },
            {
                test:/\.css$/,
                use:["style-loader","css-loader"]
            }
        ]
    },
    resolve: {
        alias: {
            'vue$': 'vue/dist/vue.common.js'
        }
    }
}