# aBSREL

## Results Summary in top box

### Above divider

#### Significant
aBSREL **found evidence** (LRT, p \leq 0.05) of episodic diversifying selection on X out of Y branches in your phylogeny.
A total of Z branches were formally tested for diversifying selection. 
<br>*[placeholder text highlighting parts of page]*Significance and number of rate categories inferred at each branch are provided in the detailed results table. 

#### Not significant
aBSREL **found no evidence** (LRT, p \leq 0.05) of episodic diversifying selection in your phylogeny. A total of Z branches were formally tested for diversifying selection. 


### Below divider
See [here](http://hyphy.org/methods/selection-methods/#absrel) for more information about the aBSREL method.
<br>
Please cite [PMID 25697341](https://www.ncbi.nlm.nih.gov/pubmed/25697341) if you use this result in a publication, presentation, or other scientific work.






## Text summaries to go beneath components

### Tree Table
This table contains a summary of the inferred aBSREL model complexity. Each row provides information about the branches that were best described by the given number of w rate categories.

### Tree itself
The fitted phylogeny with branches showing inferred omega values and proportions of sites.

### Detailed Results
> Depending on design considerations this text could be an info button, or no text at all is needed. This could be overkill.

Caution: omega distribution should not be interpretted as literal omega estimates at individual sites, but instead reflects fitted parameter values.

### w distribution
> Idea: maybe label the dashed line at the top w/ "w=1". Related, move the download buttons to be right justified on same line as Node/Tip name?

Note that omega values are not 

### Model fits
This table reports a statistical summary of the models fit to the data.



## Tool tips

### Tree Table 
* **w** - Number of $\omega$ rate classes inferred.
* **\# of branches** - Number of branches with this many rate classes.
* **% of branches** - Percentage of branches with this many rate classes.
* **% of tree length** - Percentage of tree length with this many rate classes.
* **\# under selection** - Number of selected brances with this many rate classes.


### Detailed Results Table 

* **Name** - Branch of interest
* **B** - Optimized branch length.
* **LRT** - Likelihood Ratio Test statistic for selection.
* **Test p-value** - P-value corrected for multiple testing
* **Uncorrected p-value** - P-values which have not been corrected for multiple testing.
* **w distribution over sites** - Inferred w estimates and respective proportion of sites.


### Model Fits Table
> This Table appears to be missing some columns. tool tips given here for all columns expected.

* **Model** - *does not need tool tip, but the models MG94 and Full Model will need something, perhaps info button?*
* **log L** - Log likelihood of model fit.
* **\# par.** - Number of estimated parameters
* **Time to fit** - Total clock time to fit the respective model.
* **AIC<sub>c</sub>**  - Small-sample Akaike Information Criterion


#### Models themselves
* **MG94** - The baseline MG94xREV model fit where a single w is inferred per branch.
* **Full Model** - The full aBSREL model fit where each branch is modeled by the optimal number of w categories.






## Info buttons

### Tree itself
"Hover over a branch to see its inferred rates and significance for selection."

### Detailed Results
"Bolded rows indicate branches inferred to be under positive selection at the designated p-value threshold. Click on a row to visualize its inferred rate distribution." 



