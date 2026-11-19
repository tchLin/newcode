#include <iostream>
#include <vector>
#include <string>
#include <algorithm>
#include <unordered_map>
#include <unordered_set>
#include <map>
#include <set>
#include <queue>
#include <functional>
#include <optional>
#include <sstream>
#include <stdexcept>
#include <climits>
using namespace std;
class Solution{public:
Node* cloneGraph(Node* node){unordered_map<Node*,Node*> copies;function<Node*(Node*)> f=[&](Node* n)->Node*{if(!n)return nullptr;if(copies.count(n))return copies[n];auto c=new Node(n->val);copies[n]=c;for(auto v:n->neighbors)c->neighbors.push_back(f(v));return c;};return f(node);}
string alienOrder(vector<string>& words){map<char,set<char>> adj;map<char,int> deg;for(auto s:words)for(char c:s)deg[c]=0;for(size_t i=1;i<words.size();i++){auto a=words[i-1],b=words[i];size_t j=0;while(j<min(a.size(),b.size())&&a[j]==b[j])j++;if(j==b.size()&&a.size()>b.size())return "";if(j<min(a.size(),b.size())&&adj[a[j]].insert(b[j]).second)deg[b[j]]++;}queue<char> q;for(auto[c,d]:deg)if(!d)q.push(c);string out;while(!q.empty()){char c=q.front();q.pop();out+=c;for(char v:adj[c])if(!--deg[v])q.push(v);}return out.size()==deg.size()?out:"";}
ListNode* reverseList(ListNode* head){ListNode* prev=nullptr;while(head){auto next=head->next;head->next=prev;prev=head;head=next;}return prev;}
bool hasCycle(ListNode* head){unordered_set<ListNode*> seen;while(head){if(!seen.insert(head).second)return true;head=head->next;}return false;}
ListNode* mergeTwoLists(ListNode* a,ListNode* b){ListNode dummy;auto t=&dummy;while(a&&b){if(a->val<=b->val){t->next=a;a=a->next;}else{t->next=b;b=b->next;}t=t->next;}t->next=a?a:b;return dummy.next;}
ListNode* mergeKLists(vector<ListNode*>& lists){ListNode* out=nullptr;for(auto n:lists)out=mergeTwoLists(out,n);return out;}
ListNode* removeNthFromEnd(ListNode* head,int n){ListNode dummy(0,head);auto a=&dummy,b=&dummy;for(int i=0;i<=n;i++)b=b->next;while(b){a=a->next;b=b->next;}a->next=a->next->next;return dummy.next;}
void reorderList(ListNode* head){vector<ListNode*> a,out;for(auto p=head;p;p=p->next)a.push_back(p);int l=0,r=(int)a.size()-1;while(l<=r){out.push_back(a[l++]);if(l<=r)out.push_back(a[r--]);}for(size_t i=0;i<out.size();i++)out[i]->next=i+1<out.size()?out[i+1]:nullptr;}
vector<vector<string>> groupAnagrams(vector<string>& strs){map<string,vector<string>> m;for(auto s:strs){auto k=s;sort(k.begin(),k.end());m[k].push_back(s);}vector<vector<string>> out;for(auto&[k,v]:m)out.push_back(v);return out;}
int maxDepth(TreeNode* root){return root?1+max(maxDepth(root->left),maxDepth(root->right)):0;}
bool isSameTree(TreeNode* p,TreeNode* q){return p&&q?p->val==q->val&&isSameTree(p->left,q->left)&&isSameTree(p->right,q->right):p==q;}
TreeNode* invertTree(TreeNode* root){if(root){swap(root->left,root->right);invertTree(root->left);invertTree(root->right);}return root;}
int maxPathSum(TreeNode* root){int best=INT_MIN;function<int(TreeNode*)> f=[&](TreeNode* n){if(!n)return 0;int a=max(0,f(n->left)),b=max(0,f(n->right));best=max(best,n->val+a+b);return n->val+max(a,b);};f(root);return best;}
vector<vector<int>> levelOrder(TreeNode* root){vector<vector<int>> out;function<void(TreeNode*,int)> f=[&](TreeNode* n,int d){if(!n)return;if(d==(int)out.size())out.push_back({});out[d].push_back(n->val);f(n->left,d+1);f(n->right,d+1);};f(root,0);return out;}
bool isSubtree(TreeNode* root,TreeNode* subRoot){return root&&(isSameTree(root,subRoot)||isSubtree(root->left,subRoot)||isSubtree(root->right,subRoot));}
TreeNode* buildTree(vector<int>& preorder,vector<int>& inorder){size_t at=0;function<TreeNode*(int,int)> f=[&](int l,int r)->TreeNode*{if(l>=r)return nullptr;int v=preorder[at++],p=l;while(inorder[p]!=v)p++;auto n=new TreeNode(v);n->left=f(l,p);n->right=f(p+1,r);return n;};return f(0,inorder.size());}
bool isValidBST(TreeNode* root){function<bool(TreeNode*,long long,long long)> f=[&](TreeNode* n,long long l,long long r){return !n||(l<n->val&&n->val<r&&f(n->left,l,n->val)&&f(n->right,n->val,r));};return f(root,LLONG_MIN,LLONG_MAX);}
int kthSmallest(TreeNode* root,int k){vector<int> a;function<void(TreeNode*)> f=[&](TreeNode* n){if(n){f(n->left);a.push_back(n->val);f(n->right);}};f(root);return a[k-1];}
TreeNode* lowestCommonAncestor(TreeNode* root,TreeNode* p,TreeNode* q){while(root){if(max(p->val,q->val)<root->val)root=root->left;else if(min(p->val,q->val)>root->val)root=root->right;else return root;}return nullptr;}
vector<string> findWords(vector<vector<char>>& board,vector<string>& words){vector<string> out;set<string> seen;for(auto w:words){function<bool(int,int,int)> f=[&](int r,int c,int i){if(i==(int)w.size())return true;if(r<0||c<0||r>=(int)board.size()||c>=(int)board[0].size()||board[r][c]!=w[i])return false;char x=board[r][c];board[r][c]=0;bool found=f(r+1,c,i+1)||f(r-1,c,i+1)||f(r,c+1,i+1)||f(r,c-1,i+1);board[r][c]=x;return found;};bool found=false;for(int r=0;r<(int)board.size();r++)for(int c=0;c<(int)board[r].size();c++)found=found||f(r,c,0);if(found&&seen.insert(w).second)out.push_back(w);}return out;}
};
class StringCodec{public:string encode(vector<string>& strs){string out;for(auto s:strs)out+=to_string(s.size())+"#"+s;return out;}vector<string> decode(string data){vector<string> out;size_t i=0;while(i<data.size()){auto j=data.find('#',i);size_t n=stoull(data.substr(i,j-i));out.push_back(data.substr(j+1,n));i=j+1+n;}return out;}};
class TreeCodec{public:string serialize(TreeNode* root){return root?to_string(root->val)+","+serialize(root->left)+serialize(root->right):"#,";}TreeNode* deserialize(string data){istringstream stream(data);function<TreeNode*()> f=[&]()->TreeNode*{string s;getline(stream,s,',');if(s=="#")return nullptr;auto n=new TreeNode(stoi(s));n->left=f();n->right=f();return n;};return f();}};
class Trie{set<string> words;public:void insert(string word){words.insert(word);}bool search(string word){return words.count(word);}bool startsWith(string p){for(auto s:words)if(s.rfind(p,0)==0)return true;return false;}};
class WordDictionary{set<string> words;public:void addWord(string word){words.insert(word);}bool search(string p){for(auto s:words){if(s.size()!=p.size())continue;bool ok=true;for(size_t i=0;i<p.size();i++)if(p[i]!='.'&&p[i]!=s[i])ok=false;if(ok)return true;}return false;}};
class MedianFinder{vector<int> a;public:void addNum(int n){a.push_back(n);}double findMedian(){sort(a.begin(),a.end());int m=a.size()/2;return a.size()%2?a[m]:((double)a[m-1]+a[m])/2;}};
