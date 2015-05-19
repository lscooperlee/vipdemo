import os
import numpy as np
import struct, gzip
import random
from django.core.files import File


class mnist():

    def __init__(self):
        DATAPATH=os.path.abspath(os.path.dirname(__file__))
        self.test_fname_images  = DATAPATH+'/data/t10k-images-idx3-ubyte.gz'
        self.test_fname_labels  = DATAPATH+'/data/t10k-labels-idx1-ubyte.gz'


    def _read_labels(self, fname):
        f = gzip.GzipFile(fname, 'rb')
        # 2 big-ending integers
        magic_nr, n_examples = struct.unpack(">II", f.read(8))
        # the rest, using an uint8 dataformat (endian-less)
        labels = np.fromstring(f.read(), dtype='uint8')
        return labels

    def _read_images(self, fname):
        f = gzip.GzipFile(fname, 'rb')
        # 4 big-ending integers
        magic_nr, n_examples, rows, cols = struct.unpack(">IIII", f.read(16))
        shape = (n_examples, rows*cols)
        # the rest, using an uint8 dataformat (endian-less)
        images = np.fromstring(f.read(), dtype='uint8').reshape(shape)
        return images

    def random_select(self,n):
        imgs=self._read_images(self.test_fname_images)
        labels=self._read_labels(self.test_fname_labels).tolist()
        np.random.shuffle(imgs)
        images=imgs[:n]
        images[images>0]=1

        return images.tolist()
