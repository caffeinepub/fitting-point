module {
  type Actor = {
    adminEmail : ?Text;
    adminPassword : ?Text;
  };

  public func run(old : Actor) : Actor {
    { old with adminEmail = ?"fitting.point.official@gmail.com"; adminPassword = ?"Farhan@456" };
  };
};
