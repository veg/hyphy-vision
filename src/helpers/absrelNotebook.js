/**
 * Compatibility shims for the @spond/absrel Observable notebook (v5186).
 *
 * aBSREL only writes "Site Log Likelihood" (and per-branch "posterior") from
 * aBSREL v2.5 / HyPhy 2.5.58 onward. For older result files the notebook's
 * `profileBranchSites` cell is empty, so its `siteTableData` cell calls
 * `d3.sum(undefined, ...)` for every codon and throws "t is not iterable"
 * (Safari: "undefined is not an object (evaluating 'n of t')"). That error
 * propagates to `viewof table1` and `figure1` (via fig1data), see veg/hyphy-vision#888.
 */

export function hasSiteLevelResults(json) {
  return !!(json && json["Site Log Likelihood"]);
}

// Same as the notebook's `siteTableData` cell, except that codons with no
// branch-site profile no longer crash, and the Subs / ER columns are left out
// entirely when the result file has no branch-site profiles at all (rather
// than showing a column of zeros).
export function siteTableData(
  _,
  profileBranchSites,
  results_json,
  siteIndexPartitionCodon,
  srv_distribution,
  distMean,
  d3,
  pv,
  html
) {
  let site_info = [];
  let index = 0;
  const has_profiles = profileBranchSites.length > 0;
  let bySite = _.groupBy(profileBranchSites, d => d.site);
  _.each(results_json["data partitions"], (pinfo, partition) => {
    _.each(pinfo["coverage"][0], (ignore, i) => {
      let site_record = {
        Codon: siteIndexPartitionCodon[index][1]
      };

      const sll = _.get(results_json, [
        "Site Log Likelihood",
        "unconstrained",
        0,
        index
      ]);
      if (sll) {
        site_record["LogL"] = sll;
      }

      if (srv_distribution) {
        let site_srv = [];
        _.each(srv_distribution, (d, i) => {
          site_srv.push({
            value: d.value,
            weight: results_json["Synonymous site-posteriors"][i][index]
          });
        });
        site_record["SRV posterior mean"] = distMean(site_srv);
      }

      if (has_profiles) {
        const at_site = bySite[i + 1] || [];
        site_record["Subs"] = d3.sum(at_site, d => d.subs);
        site_record["ER"] = _.filter(at_site, d => d.ER >= pv).length;
      }

      site_info.push(site_record);
      index++;
    });
  });
  return [
    site_info,
    {
      Codon: html`<abbr title="Site">Codon</abbr>`,
      "SRV posterior mean": html`<abbr title="Posterior mean of the synonymous rate, α;">E<sub>post</sub>[α]</abbr>`,
      LogL: html`<abbr title="Site log-likelihood under the unconstrained model">log(L)</abbr>`,
      Subs: html`<abbr title="Total # of substitutions (s+ns)">Subs</abbr>`,
      ER: html`<abbr title="Total # branches with evidence ratio > ${pv}">ER Branch</abbr>`
    }
  ];
}

export function patchAbsrelNotebook(main) {
  main.redefine(
    "siteTableData",
    [
      "_",
      "profileBranchSites",
      "results_json",
      "siteIndexPartitionCodon",
      "srv_distribution",
      "distMean",
      "d3",
      "pv",
      "html"
    ],
    siteTableData
  );
}
