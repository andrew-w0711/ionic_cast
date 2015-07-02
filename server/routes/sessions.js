var sessions = [
    {id:0 , title:"Work Order 1", speaker:"NATHAN HAKE", time:"9:40am", room:"Ballroom A", description: "Collaboratively administrate empowered markets via plug-and-play networks. Dynamically procrastinate B2C users after installed base benefits. Dramatically visualize customer directed convergence without revolutionary ROI."},
    {id:1 , title:"Work Order 2", speaker:"NATHAN HAKE", time:"10:10am", room:"Ballroom B", description: "Efficiently unleash cross-media information without cross-media value. Quickly maximize timely deliverables for real-time schemas. Dramatically maintain clicks-and-mortar solutions without functional solutions."},
    {id:2 , title:"Work Order 3", speaker:"NATHAN HAKE", time:"11:10am", room:"Ballroom A", description: "Completely synergize resource sucking relationships via premier niche markets. Professionally cultivate one-to-one customer service with robust ideas. Dynamically innovate resource-leveling customer service for state of the art customer service."},
    {id:3 , title:"Work Order 4", speaker:"NATHAN HAKE", time:"3:10Pm", room:"Ballroom B", description: "Objectively innovate empowered manufactured products whereas parallel platforms. Holisticly predominate extensible testing procedures for reliable supply chains. Dramatically engage top-line web services vis-a-vis cutting-edge deliverables."},
    {id:4 , title:"Work Order 5", speaker:"NATHAN HAKE", time:"2:00pm", room:"Ballroom A", description: "Proactively envisioned multimedia based expertise and cross-media growth strategies. Seamlessly visualize quality intellectual capital without superior collaboration and idea-sharing. Holistically pontificate installed base portals after maintainable products."}
];

exports.findAll = function (req, res, next) {
    res.send(sessions);
};

exports.findById = function (req, res, next) {
    var id = req.params.id;
    res.send(sessions[id]);
};