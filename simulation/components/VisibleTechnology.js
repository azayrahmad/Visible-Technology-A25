function VisibleTechnology() {}

VisibleTechnology.prototype.Schema =
	"<a:help>Update actor variant based on researched technologies.</a:help>" +
	"<a:example>" +
		"<Greave>" +
			"<RequiredTechnology>soldier_resistance_crush_01</RequiredTechnology>" +
			"<VariantCount>3</VariantCount>" +
		"</Greave>" +
	"</a:example>" +
	"<oneOrMore>" +
		"<element>" +
			"<anyName a:help='Name of actor variant'/>" +
			"<interleave>" +
				"<element name='RequiredTechnology' a:help='Name of a technology which must be researched before the entity actor can be updated.'>" +
					"<text/>" +
				"</element>" +
				"<optional>" +
					"<element name='VariantCount' a:help='The number of available variant for the technology.'>" +
						"<data type='nonNegativeInteger'/>" +
					"</element>" +
				"</optional>" +
			"</interleave>" +
		"</element>" +
	"</oneOrMore>";

VisibleTechnology.prototype.Init = function()
{
};

VisibleTechnology.prototype.UpdateActor = function()
{
	let cmpTechnologyManager = QueryOwnerInterface(this.entity, IID_TechnologyManager);
	if (!cmpTechnologyManager)
		return;

	let cmpVisual = Engine.QueryInterface(this.entity, IID_Visual);
	if (!cmpVisual)
		return;

	for (let tech in this.template)
	{
		let variantCount = +(this.template[tech].VariantCount || 1)

		if (cmpTechnologyManager.IsTechnologyResearched(this.template[tech].RequiredTechnology))
		{
			cmpVisual.SetVariant(tech, tech + randIntInclusive(1, variantCount));
		}
		else
		{
			cmpVisual.SetVariant(tech, tech + "0");
		}
	}
}

VisibleTechnology.prototype.OnOwnershipChanged = function()
{
	if (this.initialized)
	  return;
	this.UpdateActor()
	this.initialized = true;
};

VisibleTechnology.prototype.OnGlobalResearchFinished = function(msg)
{
	const cmpOwnership = Engine.QueryInterface(this.entity, IID_Ownership);
	if (cmpOwnership.GetOwner() !== msg.player)
	  return;
	this.UpdateActor()
};

Engine.RegisterComponentType(IID_VisibleTechnology, "VisibleTechnology", VisibleTechnology);