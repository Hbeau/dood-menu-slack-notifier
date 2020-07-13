const axios = require('axios')
const Mustache = require('mustache');
const fs = require("fs")
const url = 'https://api.dood.com/graphql';


let response;

/**
 *
 * Event doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html#api-gateway-simple-proxy-for-lambda-input-format
 * @param {Object} event - API Gateway Lambda Proxy Input Format
 *
 * Context doc: https://docs.aws.amazon.com/lambda/latest/dg/nodejs-prog-model-context.html 
 * @param {Object} context
 *
 * Return doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html
 * @returns {Object} object - API Gateway Lambda Proxy Output Format
 * 
 */
exports.lambdaHandler = async (event, context) => {
    try {
        let doodResponse = await axios.post(url, {"query":"query Shops($slug: String) {shops (filters: {slug: $slug})  {...DRestaurant}} fragment DRestaurant on Shop { id slug firebase_topic name available venue { ...DVenue } pricing phone rating cover edenred_enabled onsite_enabled  favorited { id } store { ...DProdCategory } type { ...DCategory } schedule { ...DSchedule } } fragment DVenue on Venue { address { addressee streetAddress country postalCode city } coordinates { ln lt } distance } fragment DProdCategory on ProductCategory { id name position products { ...DProduct } course{ ...DCourse }} fragment DCategory on Type { id name icon} fragment DSchedule on Schedule { id start end opened venue {     ...DVenue   }} fragment DProduct on Product { id name price discount description available type ... on SimpleProduct { ...DSimpleProduct} ... on DeclinableProduct { ...DDeclinableProduct }} fragment DCourse on Course{ id name icon} fragment DSimpleProduct on SimpleProduct {id name price discount description available allergens { ...DAllergen } preparation_time vat icon} fragment DDeclinableProduct on DeclinableProduct { id name price discount description available categories { ...DDeclinableProductCategory  } } fragment DDeclinableProductCategory on DeclinableProductCategory{ products { ...DSimpleProduct}store { id name position course{ ...DCourse}}count} fragment DAllergen on Allergen { id icon description name}","variables":{"slug":"peko-peko-food-truck"}})
        
        let menus = doodResponse.data.data.shops[0].store 
        var page = fs.readFileSync("templates.mustache").toString();
        let render = Mustache.render(page,{"menus" : menus})

        response = {
            'statusCode': doodResponse.status,
            'text': render 
        }
    } catch (err) {
        console.log(err);
        return err;
    }

    return response
};
