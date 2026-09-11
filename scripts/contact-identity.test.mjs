import test from "node:test";
import assert from "node:assert/strict";
import { matchesLicenseLocation } from "../src/lib/contact-identity.mjs";
const row={license_number:"CAC020219",city:"PLANT CITY",zip:"33567"};
test("a Florida namesake with a different license does not establish identity",()=>{
  assert.equal(matchesLicenseLocation("David's Mechanical Services LLC, Tampa, Florida. State cert. CAC1822238",row),false);
});
test("an exact license or contiguous city and ZIP confirms the local identity",()=>{
  assert.equal(matchesLicenseLocation("License CAC020219",row),true);
  assert.equal(matchesLicenseLocation("<p>Plant City, FL 33567</p>",row),true);
  assert.equal(matchesLicenseLocation("Plant City 33567",row),true);
});
test("a partial license or unrelated city and ZIP mentions do not match",()=>{
  assert.equal(matchesLicenseLocation("CAC0202199",row),false);
  assert.equal(matchesLicenseLocation("We serve Plant City. Main office Tampa, FL 33567",row),false);
  assert.equal(matchesLicenseLocation("<script>Plant City, FL 33567</script>",row),false);
});
