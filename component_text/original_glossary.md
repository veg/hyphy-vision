This glossary provides definitions for terms in the HyPhy-Vision reports for each method. See [here](./methods/selection-methods) for descriptions of each method.


## Shared Terms

* ***log* L** - The log likelihood estimate of the respective model fit.
* **\# par.** - The number of estimated parameters in the respective model.
* **Time to fit** - Total clock time to fit the respective model.
* **AIC<sub>c</sub>**  - [Small-sample Akaike Information Criterion](http://www.tandfonline.com/doi/abs/10.1080/03610927808827599) score.
* **L<sub>tree</sub>** - The tree length under the respective model, where tree length represents the expected number of substitutions per site.


<!-- I think the following has been removed from vision
### Summary Statistics **\\\\ has this info since been removed?**
* **number of sequences** - the number of sequences present in the input file
* **number of variants** - the number of variants present in the input file
* **number of branches** - the number of branches in the phylogeny
-->


## aBSREL Glossary


### Summary: Tree Table

* **$\boldsymbol \omega$ rate classes** - Number of $\omega$ rate classes inferred.
* **\# of branches** - The number of branches inferred to have the respective number of $\omega$ rate classes.
* **% of branches** - The proportion of branches inferred to have the respective number of $\omega$ rate classes.
* **% of tree length** - The percentage of the total tree length inferred to have the respective number of $\omega$ rate classes.
* **\# under selection** - The number of branches inferred to have undergone positive selection (a rate class of $\omega>1$) at the designated p-value threshold, after correction for multiple testing.

### Summary: Model Fits Table

* **MG94** - The baseline model fit of [MG94xREV](./methods/selection-methods/#mg94xrev-framework) that infers a single $\omega$ per branch.
* **Full Model** - The full aBSREL model fit to the tree, where the number of $\omega$ classes per branch is inferred adaptively.
* See these [Shared Terms](glossary/#shared-terms) for additional reported information.





### Full Table

* **Name** - Branch of interest, where bolded rows indicate that the branch shows evidence, at the designated p-value threshold, of positive selection.
* **B** - Optimized (under the full aBSREL model) branch length for the branch of interest
* **LRT** - Likelihood Ratio Test statistic for selection. This LRT was calculated by comparing the fitted aBSREL model to the null model where rate classes of $\omega>1$ are disallowed.
* **Test p-value** - P-value corrected for multiple testing using the [Holm-Bonferroni correction](https://www.jstor.org/stable/4615733). These values are only calculated for branches with uncorrected p-values less than 1.
* **Uncorrected p-value** - Raw p-value before correction for multiple testing.
* **$\boldsymbol \omega$ distribution over sites** - Inferred $\omega$ estimates and respective proportion of sites along the respective branch.


<!------------------------------------------------------------------------------------->


## RELAX Glossary

### Summary: Model Fits Table


* **Null** - This model represents the null model used to test for selection relaxation. Here, the selection intensity parameter *k* is set to 1 for both branch sets (reference and test).
* **Alternative** - This model represents the alternative model used to test for selection relaxation. Here, the selection intensity parameter *k* is allowed for vary on the "test" partition of branches. Note that a single *k* is inferred and shared across all test branches.
* **Partitioned MG94xREV** - This baseline model fits a single $\omega$ value to each of the two branch sets (reference and test), respectively.
* **Partitioned Descriptive** - This model infers three $\omega$ classes distributions for each partition, respectively, without using the selection intensity parameter *k* (e.g. k=1 throughout).
* **General Descriptive** - This model fits three $\omega$ classes to the entire phylogeny, i.e. shared across all branches. This model then infers a single selection intensity parameter *k* for each branch.
* **Branch set** - The set of branches (all, test, or reference) for which the given set of $\omega$ rate classes were inferred.
* **$\boldsymbol{\omega_{<1,2,3>}}$** - The inferred $\omega$ value for the respective rate class ($\omega_1$, $\omega_2$, or $\omega_3$). The value in parentheses indicates the proportion of sites inferred to belong to this rate class.


<!------------------------------------------------------------------------------------->



## BUSTED Glossary

### Summary: Model Fits Table


* **Constrained model** - This model represents the null model used in the BUSTED hypothesis test. For this model, the background and foreground branch partitions share all $\omega$ rate classes, but the value $\omega$ rate class used to test for selection is constrained to equal 1 (i.e. $\omega_3 = 1$ for both the background and foreground branches).
* **Unconstrained model** - This model represents the alternative model used in the BUSTED hypothesis test. For this model, the value for $\omega$ rate class used to test for selection is permitted to exceed 1 on the foreground branches. (i.e. $\omega_3 > 1$ on foreground branches).
* **$\boldsymbol{\omega_{<1,2,3>}}$** - The inferred $\omega$ value for the respective rate class ($\omega_1$, $\omega_2$, or $\omega_3$). The value in parentheses indicates the proportion of sites inferred to belong to this rate class.
* See these [Shared Terms](glossary/#shared-terms) for additional reported information.


<!--
### Summary: Model Evidence Ratios Per Site

This plot shows the "Evidence Ratio" (ER), displayed as the scaled Likelihood Ratio Test statistic. The ER is calculated for a given site *s* ($ER^s$) using the likelihoods from a fitted null model ($L_{null}$) and a fitted alternative model ($L_{alt}$) at the site of interest *s*:

$$ ER^s = 2 \times \log\big{(}{ \frac{ L^s_{alt}}{L^s_{null}} }\big{)} $$

Evidence ratios provide *descriptive evidence* for whether a given site may have experienced positive selection. **Note that evidence ratios do not provide statistically valid evidence for selection at individuals sites.**

For more detailed information on the difference between the Constrained and Optimized Null evidence ratios, see [this description of BUSTED](selection-methods/#busted).
-->

### Summary: Model Evidence Ratios Per Site Table

* **Site Index** - The codon site of interest.
* **Unconstrained Likelihood** - The log likelihood score for the codon site of interest, calculated from the Unconstrained Model fit.
* **Constrained Likelihood** - The log likelihood score for the codon site of interest, calculated from the Constrained Model fit.
* **Optimized Null Likelihood** - The log likelihood score for the codon site of interest, calculated from the Optimized Null Model fit. The Optimized Null model is the Constrained model whose parameters have been re-optimized for this specific site.
* **Constrained Evidence Ratio** - Evidence ratio for positive selection at the given codon site, using the Constrained Model as the null model.
* **Optimized Null Evidence Ratio** - Evidence ratio for selection at the given codon site, using the Optimized Null model as the null model.





