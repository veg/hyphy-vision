from pyvolve import *

treefile = "50.tre"
sizes = [50, 100, 500]
for size in sizes:

    outfile = "sim_length" + str(size) + ".dat"
 
    tree = read_tree(file = treefile)
    m = Model("MG94", {"omega": [0.1, 0.3, 0.5, 1.0, 1.2, 3.0]}, rate_probs = [0.3, 0.2, 0.2, 0.2, 0.05, 0.05])
    p = Partition(size = size, model = m)
    e = Evolver(tree = tree, partitions = p)
    e(sitefile = None, infofile = None, seqfile = "temp.fasta")
    os.system("cat temp.fasta " + treefile + " > " + outfile) 
    
