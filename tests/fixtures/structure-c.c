#include <limits.h>
static char* ref_copy(const char* s){char* p=malloc(strlen(s)+1);strcpy(p,s);return p;}
static int ref_cmp(const void* a,const void* b){int x=*(const int*)a,y=*(const int*)b;return (x>y)-(x<y);}
static struct TreeNode* ref_tree(int v){struct TreeNode* t=calloc(1,sizeof(*t));t->val=v;return t;}
static struct Node* ref_clone(struct Node* n,struct Node** map){if(!n)return NULL;if(map[n->val])return map[n->val];struct Node* c=calloc(1,sizeof(*c));map[n->val]=c;c->val=n->val;c->numNeighbors=n->numNeighbors;c->neighbors=calloc(c->numNeighbors?c->numNeighbors:1,sizeof(*c->neighbors));for(int i=0;i<c->numNeighbors;i++)c->neighbors[i]=ref_clone(n->neighbors[i],map);return c;}
struct Node* cloneGraph(struct Node* node){struct Node* map[1001]={0};return ref_clone(node,map);}
char* alienOrder(char** words,int wordsSize){bool present[26]={0},edge[26][26]={0};int degree[26]={0},count=0;for(int i=0;i<wordsSize;i++)for(int j=0;words[i][j];j++)present[words[i][j]-'a']=true;for(int i=1;i<wordsSize;i++){char *a=words[i-1],*b=words[i];int j=0;while(a[j]&&b[j]&&a[j]==b[j])j++;if(a[j]&&!b[j])return ref_copy("");if(a[j]&&b[j]){int x=a[j]-'a',y=b[j]-'a';if(!edge[x][y]){edge[x][y]=true;degree[y]++;}}}int q[26],end=0;for(int i=0;i<26;i++)if(present[i]){count++;if(!degree[i])q[end++]=i;}char* out=calloc(27,1);int len=0;for(int i=0;i<end;i++){int c=q[i];out[len++]=(char)('a'+c);for(int j=0;j<26;j++)if(edge[c][j]&&!--degree[j])q[end++]=j;}if(len!=count)out[0]=0;return out;}
struct ListNode* reverseList(struct ListNode* head){struct ListNode* prev=NULL;while(head){struct ListNode* next=head->next;head->next=prev;prev=head;head=next;}return prev;}
bool hasCycle(struct ListNode* head){struct ListNode *slow=head,*fast=head;while(fast&&fast->next){slow=slow->next;fast=fast->next->next;if(slow==fast)return true;}return false;}
struct ListNode* mergeTwoLists(struct ListNode* a,struct ListNode* b){struct ListNode dummy={0,NULL},*t=&dummy;while(a&&b){if(a->val<=b->val){t->next=a;a=a->next;}else{t->next=b;b=b->next;}t=t->next;}t->next=a?a:b;return dummy.next;}
struct ListNode* mergeKLists(struct ListNode** lists,int listsSize){struct ListNode* out=NULL;for(int i=0;i<listsSize;i++)out=mergeTwoLists(out,lists[i]);return out;}
struct ListNode* removeNthFromEnd(struct ListNode* head,int n){struct ListNode dummy={0,head},*a=&dummy,*b=&dummy;for(int i=0;i<=n;i++)b=b->next;while(b){a=a->next;b=b->next;}a->next=a->next->next;return dummy.next;}
void reorderList(struct ListNode* head){struct ListNode *nodes[10000],*out[10000];int n=0;for(struct ListNode* p=head;p;p=p->next)nodes[n++]=p;int l=0,r=n-1,k=0;while(l<=r){out[k++]=nodes[l++];if(l<=r)out[k++]=nodes[r--];}for(int i=0;i<n;i++)out[i]->next=i+1<n?out[i+1]:NULL;}
static bool ref_anagram(char* a,char* b){int count[26]={0};for(int i=0;a[i];i++)count[a[i]-'a']++;for(int i=0;b[i];i++)count[b[i]-'a']--;for(int i=0;i<26;i++)if(count[i])return false;return true;}
char*** groupAnagrams(char** strs,int strsSize,int* returnSize,int** returnColumnSizes){char*** out=calloc(strsSize?strsSize:1,sizeof(*out));int* sizes=calloc(strsSize?strsSize:1,sizeof(int));int n=0;for(int i=0;i<strsSize;i++){int j=0;while(j<n&&!ref_anagram(out[j][0],strs[i]))j++;if(j==n){out[n++]=calloc(strsSize,sizeof(char*));}out[j][sizes[j]++]=ref_copy(strs[i]);}*returnSize=n;*returnColumnSizes=sizes;return out;}
char* stringCodecEncode(char** strs,int strsSize){size_t size=1;for(int i=0;i<strsSize;i++)size+=strlen(strs[i])+30;char* out=malloc(size);int at=0;for(int i=0;i<strsSize;i++){int n=(int)strlen(strs[i]);at+=sprintf(out+at,"%d#",n);memcpy(out+at,strs[i],n);at+=n;}out[at]=0;return out;}
char** stringCodecDecode(char* data,int* returnSize){char** out=calloc(strlen(data)+1,sizeof(char*));int n=0,at=0;while(data[at]){int len=0;while(data[at]!='#')len=len*10+data[at++]-'0';at++;out[n]=calloc(len+1,1);memcpy(out[n++],data+at,len);at+=len;}*returnSize=n;return out;}
int maxDepth(struct TreeNode* root){if(!root)return 0;int a=maxDepth(root->left),b=maxDepth(root->right);return 1+(a>b?a:b);}
bool isSameTree(struct TreeNode* p,struct TreeNode* q){if(!p||!q)return p==q;return p->val==q->val&&isSameTree(p->left,q->left)&&isSameTree(p->right,q->right);}
struct TreeNode* invertTree(struct TreeNode* root){if(root){struct TreeNode* a=invertTree(root->left);root->left=invertTree(root->right);root->right=a;}return root;}
static int ref_gain(struct TreeNode* n,int* best){if(!n)return 0;int a=ref_gain(n->left,best),b=ref_gain(n->right,best);if(a<0)a=0;if(b<0)b=0;if(n->val+a+b>*best)*best=n->val+a+b;return n->val+(a>b?a:b);}
int maxPathSum(struct TreeNode* root){int best=INT_MIN;ref_gain(root,&best);return best;}
int** levelOrder(struct TreeNode* root,int* returnSize,int** returnColumnSizes){int** out=calloc(1000,sizeof(int*));int* sizes=calloc(1000,sizeof(int));struct TreeNode* q[10000];int front=0,end=0,levels=0;if(root)q[end++]=root;while(front<end){int size=end-front;sizes[levels]=size;out[levels]=malloc(size*sizeof(int));for(int i=0;i<size;i++){struct TreeNode* n=q[front++];out[levels][i]=n->val;if(n->left)q[end++]=n->left;if(n->right)q[end++]=n->right;}levels++;}*returnSize=levels;*returnColumnSizes=sizes;return out;}
static void ref_encode_tree(struct TreeNode* t,char* out,int* at){if(!t){*at+=sprintf(out+*at,"#,");return;}*at+=sprintf(out+*at,"%d,",t->val);ref_encode_tree(t->left,out,at);ref_encode_tree(t->right,out,at);}
char* treeCodecSerialize(struct TreeNode* root){char* out=calloc(50000,1);int at=0;ref_encode_tree(root,out,&at);return out;}
static struct TreeNode* ref_decode_tree(char** s){if(**s=='#'){*s+=2;return NULL;}char* end;long v=strtol(*s,&end,10);*s=end+1;struct TreeNode* t=ref_tree((int)v);t->left=ref_decode_tree(s);t->right=ref_decode_tree(s);return t;}
struct TreeNode* treeCodecDeserialize(char* data){return ref_decode_tree(&data);}
bool isSubtree(struct TreeNode* root,struct TreeNode* subRoot){return root&&(isSameTree(root,subRoot)||isSubtree(root->left,subRoot)||isSubtree(root->right,subRoot));}
struct TreeNode* buildTree(int* preorder,int preorderSize,int* inorder,int inorderSize){if(!preorderSize)return NULL;int v=preorder[0],i=0;while(inorder[i]!=v)i++;struct TreeNode* t=ref_tree(v);t->left=buildTree(preorder+1,i,inorder,i);t->right=buildTree(preorder+i+1,preorderSize-i-1,inorder+i+1,inorderSize-i-1);return t;}
static bool ref_valid(struct TreeNode* t,long long lo,long long hi){return !t||(t->val>lo&&t->val<hi&&ref_valid(t->left,lo,t->val)&&ref_valid(t->right,t->val,hi));}
bool isValidBST(struct TreeNode* root){return ref_valid(root,LLONG_MIN,LLONG_MAX);}
static void ref_inorder(struct TreeNode* t,int* k,int* out){if(!t)return;ref_inorder(t->left,k,out);if(--*k==0)*out=t->val;ref_inorder(t->right,k,out);}
int kthSmallest(struct TreeNode* root,int k){int out=0;ref_inorder(root,&k,&out);return out;}
struct TreeNode* lowestCommonAncestor(struct TreeNode* root,struct TreeNode* p,struct TreeNode* q){while(root){if(p->val<root->val&&q->val<root->val)root=root->left;else if(p->val>root->val&&q->val>root->val)root=root->right;else return root;}return NULL;}
typedef struct Trie{char* words[1000];int n;}Trie;
Trie* trieCreate(void){return calloc(1,sizeof(Trie));}
void trieInsert(Trie* obj,char* word){obj->words[obj->n++]=ref_copy(word);}
bool trieSearch(Trie* obj,char* word){for(int i=0;i<obj->n;i++)if(!strcmp(obj->words[i],word))return true;return false;}
bool trieStartsWith(Trie* obj,char* prefix){for(int i=0;i<obj->n;i++)if(!strncmp(obj->words[i],prefix,strlen(prefix)))return true;return false;}
typedef struct WordDictionary{char* words[1000];int n;}WordDictionary;
WordDictionary* wordDictionaryCreate(void){return calloc(1,sizeof(WordDictionary));}
void wordDictionaryAddWord(WordDictionary* obj,char* word){obj->words[obj->n++]=ref_copy(word);}
bool wordDictionarySearch(WordDictionary* obj,char* word){for(int i=0;i<obj->n;i++){char* s=obj->words[i];if(strlen(s)!=strlen(word))continue;bool ok=true;for(int j=0;word[j];j++)if(word[j]!='.'&&word[j]!=s[j])ok=false;if(ok)return true;}return false;}
static bool ref_word(char** board,int rows,int cols,int r,int c,char* word,int at){if(!word[at])return true;if(r<0||c<0||r>=rows||c>=cols||board[r][c]!=word[at])return false;char ch=board[r][c];board[r][c]=0;bool found=ref_word(board,rows,cols,r+1,c,word,at+1)||ref_word(board,rows,cols,r-1,c,word,at+1)||ref_word(board,rows,cols,r,c+1,word,at+1)||ref_word(board,rows,cols,r,c-1,word,at+1);board[r][c]=ch;return found;}
char** findWords(char** board,int boardSize,int* boardColSize,char** words,int wordsSize,int* returnSize){char** out=calloc(wordsSize?wordsSize:1,sizeof(char*));int n=0;for(int i=0;i<wordsSize;i++){bool found=false;for(int r=0;r<boardSize&&!found;r++)for(int c=0;c<boardColSize[r]&&!found;c++)found=ref_word(board,boardSize,boardColSize[0],r,c,words[i],0);if(found){bool duplicate=false;for(int j=0;j<n;j++)if(!strcmp(out[j],words[i]))duplicate=true;if(!duplicate)out[n++]=ref_copy(words[i]);}}*returnSize=n;return out;}
typedef struct MedianFinder{int a[10000];int n;}MedianFinder;
MedianFinder* medianFinderCreate(void){return calloc(1,sizeof(MedianFinder));}
void medianFinderAddNum(MedianFinder* obj,int num){obj->a[obj->n++]=num;}
double medianFinderFindMedian(MedianFinder* obj){qsort(obj->a,obj->n,sizeof(int),ref_cmp);int m=obj->n/2;return obj->n%2?obj->a[m]:((double)obj->a[m-1]+obj->a[m])/2;}
