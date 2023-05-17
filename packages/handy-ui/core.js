var myUi = `
<div>
<temp.create name="button" >
        <button target='button' class="bg-white border rounded-lg py-1 hover:bg-gray-50 shadow-sm px-3 text-gray-700">_children_</button>
</temp.create>
<temp.create name="input" >
        <input target='input' class="bg-white outline-gray-200 border rounded-lg py-1 hover:bg-gray-50 shadow-sm px-3 text-gray-700"/>
</temp.create>
</div>
`
myUi=elementFromHtml(myUi)