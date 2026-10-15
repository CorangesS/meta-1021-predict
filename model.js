(function(root){
  'use strict';
  const actual={
    q2:{revenue:60801,costs:42026,op:18775,margin:.31,tax:2908,taxrate:.16,net:15848,eps:6.18,ad:59363,other:1007,rl:431,foa:60370,foaOp:23394,rlOp:-4619,interest:-19,pretax:18756,shares:2566,basicShares:2543,basicEPS:6.23,costRevenue:11330,rd:21656,marketing:3431,ga:5609,cfo:31862,ppe:30116,lease:962,capex:31078,fcf:784,da:6356,sbc:7658,dap:3.60,impressions:.14,price:.12,headcount:75472,cash:90260,debt:83664,dividends:1353,repurchases:0},
    q325:{revenue:51242,costs:30707,op:20535,margin:.40,tax:18954,taxrate:.87,net:2709,eps:1.05,ad:50082,other:690,rl:470,foa:50772,foaOp:24967,rlOp:-4432,cfo:29999,capex:19374,fcf:10625,dap:3.54,impressions:.14,price:.10,headcount:78450,adjustedEPS:7.25},
    h1:{revenue:117111,costs:75464,op:41647,cfo:64088,capex:50918,fcf:13170},
    fy25:{revenue:200966,op:83276},q425:{revenue:59893}
  };
  const scenarios={
    bear:{label:'谨慎',impressions:.10,price:.08,otherExMuse:1050,muse:.1,rl:520,costRevenue:13000,rd:23500,marketing:3800,gaCore:3900,legal:10000,interest:-300,taxrate:.17,shares:2575,basicShares:2550,cfo:29000,capex:43000,lease:1100,da:7000,sbc:8200,dap:3.62,headcount:71000,rlOp:-5100},
    base:{label:'基准',impressions:.12,price:.10,otherExMuse:1150,muse:1,rl:600,costRevenue:12500,rd:22800,marketing:3650,gaCore:3750,legal:10000,interest:-100,taxrate:.16,shares:2570,basicShares:2545,cfo:33000,capex:40000,lease:1100,da:7000,sbc:8000,dap:3.64,headcount:69000,rlOp:-4800},
    bull:{label:'积极',impressions:.14,price:.11,otherExMuse:1300,muse:5,rl:750,costRevenue:12500,rd:22600,marketing:3600,gaCore:3600,legal:10000,interest:100,taxrate:.15,shares:2565,basicShares:2540,cfo:36000,capex:37000,lease:1100,da:7200,sbc:8000,dap:3.67,headcount:68000,rlOp:-4500}
  };
  function calculate(key='base',shield=1){
    const s={...scenarios[key]};
    s.ad=actual.q325.ad*(1+s.impressions)*(1+s.price);
    s.other=s.otherExMuse+s.muse;s.foa=s.ad+s.other;s.revenue=s.foa+s.rl;
    s.coreCosts=s.costRevenue+s.rd+s.marketing+s.gaCore;
    s.ga=s.gaCore+s.legal;s.costs=s.coreCosts+s.legal;
    s.coreOp=s.revenue-s.coreCosts;s.op=s.coreOp-s.legal;s.margin=s.op/s.revenue;
    s.pretax=s.op+s.interest;s.corePretax=s.coreOp+s.interest;
    s.tax=s.corePretax*s.taxrate-s.legal*s.taxrate*shield;
    s.effectiveTax=s.tax/s.pretax;s.net=s.pretax-s.tax;
    s.eps=s.net/s.shares;s.basicEPS=s.net/s.basicShares;
    s.coreNet=s.corePretax*(1-s.taxrate);s.coreEPS=s.coreNet/s.shares;
    s.legalEPS=(s.legal-s.legal*s.taxrate*shield)/s.shares;
    s.foaOp=s.op-s.rlOp;s.ppe=s.capex-s.lease;s.fcf=s.cfo-s.capex;
    s.cashBridgeResidual=s.cfo-s.net-s.da-s.sbc-s.legal;
    s.revYoY=s.revenue/actual.q325.revenue-1;s.revQoQ=s.revenue/actual.q2.revenue-1;
    s.shield=shield;return s;
  }
  function museRevenue(avgPaid,arppu,days=23){return avgPaid*arppu*days/30;}
  const api={actual,scenarios,calculate,museRevenue};
  if(typeof module!=='undefined'&&module.exports)module.exports=api;
  else root.MetaModel=api;
})(typeof globalThis!=='undefined'?globalThis:this);
