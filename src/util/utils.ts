import { StockModel } from "../model/StockModel";

export function getCodeWithPlace( stock : StockModel ) : string { 
    if(stock.market === 1){
        return stock.place === 1? "SH"+stock.code : "SZ"+stock.code
    }
    return stock.code
}