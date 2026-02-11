module {
  public func run(old : { adminEmail : ?Text; adminPassword : ?Text }) : { adminEmail : ?Text; adminPassword : ?Text } {
    { old with adminEmail = ?"fitting.point.official@gmail.com"; adminPassword = ?"Farhan@456" };
  };
};
