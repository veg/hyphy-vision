# BUSTED

> Anything thusly formatted = comments from Stephanie, don't implement these as text...


> The order of this page should be:
> <br>1)  summary paragraph
> <br>2) model fits
> <br> 3) w distributions (if we're keeping it), so that users can click a row in model fits table and see the distribution conveniently 
> <br> 4) ER figure then ER table
>  <br> 5) tree



## Results Summary in top box

### Above divider

#### Significant
BUSTED **found evidence** (LRT, p \leq 0.05) of gene-wide episodic diversifying selection in the selected foreground of your phylogeny. Therefore, there is evidence that at least one site on at least one foreground branch has experienced diversifying selection. 
<br> *[placeholder text highlighting parts of page]*Evidence ratios providing descriptive evidence for whether each site experienced diversifying selection.

#### Significant
BUSTED **found no evidence** (LRT, p \leq 0.05) of gene-wide episodic diversifying selection in the selected foreground of your phylogeny. Therefore, there no is evidence that any sites have experienced diversifying selection along the foreground branch(es).

### Below divider
See [here](http://hyphy.org/methods/selection-methods/#busted) for more information about the BUSTED method.
<br>
Please cite [PMID 25701167](https://www.ncbi.nlm.nih.gov/pubmed/25701167) if you use this result in a publication, presentation, or other scientific work.


## Text summaries to go beneath components

### Model fits
This table reports a statistical summary of the models fit to the data. The *Unconstrained* model refers to the BUSTED alternative model, and the *Constrained* model refers to the BUSTED null model.

### ER plot
This figure shows site Evidence Ratios (ERs), displayed as the scaled Likelihood Ratio Test statistic, that provide *descriptive evidence* for whether a given site may have experienced positive selection.

### Threshold text things
> This is a mess. I'm going to lobby to remove it. OR it needs to be on the same scale as the figure. Currently they are on different scales, which leads to confusing and seemingly odd behavior. Either way it's not super clear why this needs to be here at all. It's just visual clutter at the moment.

### ER table
> I dont think this needs anything

### Input tree
> I dont think this needs anything

### w distribution
> If this is going to be included, it MUST be in a different place on the page and have functionality to show different model fits. Currently it's just showing one FG distribution of mystery.

## Tool tips


### Model fits table

* **Model** - *does not need tool tip*
* **log L** - Log likelihood of model fit.
* **\# par.** - Number of estimated parameters
* **AIC<sub>c</sub>**  - Small-sample Akaike Information Criterion
* **Time to fit** - Total clock time to fit the respective model.
* **Ltree** - Tree length for fitted model.
* **Branch set** - Fitted branch partition
* **w1,2,3 (each)** - Inferred omega category (proportion of sites)


### Model Evidence Ratios Per Site Table

* **Site Index** - The codon site of interest.
* **Unconstrained Likelihood** - Site LogL calculated from the Unconstrained Model fit.
* **Constrained Likelihood** - Site LogL calculated from the Constrained Model fit.
* **Optimized Null Likelihood** - Site LogL calculated from the Optimized Null Model (site-optimized Constrained Model)
* **Constrained Evidence Ratio** - Evidence ratio for positive selection, using the Constrained Model as the null model.
* **Optimized Null Evidence Ratio** - Evidence ratio for positive selection, using the Optimized Null Model as the null model.

## Info buttons


### Tree itself
> Is the tree supposed to do anything here? Currently very broken.

### ER figure
Click and drag within the figure to examine a specific range of sites.




