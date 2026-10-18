import importlib.util
import json
import unittest
from pathlib import Path
spec=importlib.util.spec_from_file_location('scrape',Path(__file__).with_name('scrape.py'))
scrape=importlib.util.module_from_spec(spec);spec.loader.exec_module(scrape)

class ScrapeTests(unittest.TestCase):
    def test_flight_resolves_multibyte_length_prefixed_text(self):
        text='Title: café 🚀\n';encoded=text.encode()
        stream='1:T'+format(len(encoded),'x')+','+text+'2:'+json.dumps(['$','element',None,{'initial':{'slug':'demo','description':'$1','literal':'$$schema','missing':'$undefined'}}])+'\n'
        html='<script>self.__next_f.push('+json.dumps([1,stream])+')</script>'
        self.assertEqual(scrape.prop(html,'initial')['description'],text)
        self.assertEqual(scrape.prop(html,'initial')['literal'],'$schema')
        self.assertNotIn('missing',scrape.prop(html,'initial'))
    def test_ranks_reproduce_ui_categories_and_community_pagination(self):
        rows=[{'slug':str(i),'categories':['sales-crm'],'curated':i%2==0}for i in range(201)]
        views=scrape.ranks(rows)
        self.assertEqual(len(views),26)
        self.assertEqual(len(views['all:community_false']),101)
        self.assertEqual(views['all:community_true'][100]['show_more_page'],2)
        self.assertEqual(len(views['sales-and-marketing:community_true']),201)
    def test_unknown_legacy_category_appears_only_in_all(self):
        views=scrape.ranks([{'slug':'x','categories':['travel'],'curated':True}])
        self.assertEqual(len(views['all:community_true']),1)
        self.assertTrue(all(not rows for key,rows in views.items()if not key.startswith('all:')))
    def test_hosting_does_not_prove_publisher(self):
        self.assertFalse(scrape.is_manufact({'name':'Example','slug':'example-run-mcp-use-com','url':'https://example.run.mcp-use.com/mcp'}))
        self.assertFalse(scrape.is_manufact({'name':'example.run.mcp-use.com'}))
        self.assertTrue(scrape.is_manufact({'name':'Manufact Cloud'}))
        self.assertTrue(scrape.is_manufact({'name':'mcp-use docs'}))
    def test_null_metadata_is_not_a_collection_failure(self):
        self.assertFalse(scrape.is_manufact({'name':'Other','protocolMetadata':None}))
    def test_grades_match_published_client_thresholds(self):
        self.assertEqual([scrape.grade(s)for s in[None,0,69,70,84,85,94,95,100]],[None,'C','C','B','B','A','A','A+','A+'])

if __name__=='__main__':unittest.main()
