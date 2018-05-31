from pyvolve import *
import sys, os


trees = [x for x in os.listdir(".") if x.endswith(".tre")]
size = 50

for treefile in trees:
    print treefile
    outfile = "sim_" + treefile.split(".tre")[0] + "taxa.dat"
 
    tree = read_tree(file = treefile)
    m = Model("MG94", {"omega": [0.1, 0.3, 0.5, 1.0, 1.2, 3.0]}, rate_probs = [0.3, 0.2, 0.2, 0.2, 0.05, 0.05])
    p = Partition(size = size, model = m)
    e = Evolver(tree = tree, partitions = p)
    assert 1==5
    e(sitefile = None, infofile = None, seqfile = "temp.fasta")
    os.system("cat temp.fasta " + treefile + " > " + outfile) 
    
