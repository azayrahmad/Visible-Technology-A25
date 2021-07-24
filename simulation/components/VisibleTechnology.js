function VisibleTechnology() {}

VisibleTechnology.prototype.Schema =
	"<a:help>Update actor variant based on researched technologies.</a:help>" +
	"<a:example>" +
		"<Greave>" +
			"<RequiredTechnology>soldier_resistance_crush_01</RequiredTechnology>" +
		"</Greave>" +
	"</a:example>" +
	"<oneOrMore>" +
		"<element>" +
			"<anyName a:help='Name of actor variant'/>" +
			"<interleave>" +
				"<element name='RequiredTechnology' a:help='Name of a technology which must be researched before the entity actor can be updated.'>" +
					"<text/>" +
				"</element>" +
			"</interleave>" +
		"</element>" +
	"</oneOrMore>";

VisibleTechnology.prototype.Init = function()
{
	warn("VisibleTechnology initialized")
	this.UpdateActor()
};

VisibleTechnology.prototype.UpdateActor = function()
{
 	warn("UpdateActor Started")

	let cmpTechnologyManager = Engine.QueryInterface(this.entity, IID_TechnologyManager);
	if (!cmpTechnologyManager)
		return;
	warn("cmpTechnologyManager loaded")

	let cmpVisual = Engine.QueryInterface(this.entity, IID_Visual);
	if (!cmpVisual)
		return;
	warn("cmpVisual loaded")

	for (let tech in this.template)
	{
		warn("visible tech status of " + tech)
		if (cmpTechnologyManager.IsTechnologyResearched(this.template[tech].RequiredTechnology))
		{
			cmpVisual.SetVariant(tech, tech + "1");
			warn(tech + " researched")
		}
		else
		{
			cmpVisual.SetVariant(tech, tech + "0");
			warn(tech + "not researched")
		}
	}
}

VisibleTechnology.prototype.OnResearchFinished = function(msg)
{
	warn("VisibleTechnology on research finished")
	this.UpdateActor()
};


Engine.RegisterComponentType(IID_VisibleTechnology, "VisibleTechnology", VisibleTechnology);