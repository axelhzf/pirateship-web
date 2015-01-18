describe("etaFilter", function () {

  it("should format seconds", function () {
    expect(etaFilter("100")).to.eql("2 minutes");
  });

  it("should return na if not valid seconds", function () {
    expect(etaFilter("-10")).to.eql("na");
    expect(etaFilter("asb")).to.eql("na");
    expect(etaFilter(undefined)).to.eql("na");
  });

});